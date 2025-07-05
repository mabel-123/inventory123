from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Sum, F, Count
from django.utils import timezone
from datetime import timedelta
from .models import Category, Supplier, Product, StockMovement, Sale
from .forms import ProductForm, CategoryForm, SupplierForm, StockMovementForm, SaleForm
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import (
    CategorySerializer, SupplierSerializer, ProductSerializer,
    StockMovementSerializer, SaleSerializer, DashboardSerializer
)

@login_required
def dashboard(request):
    total_products = Product.objects.count()
    low_stock_products = Product.objects.filter(quantity__lte=F('reorder_level')).count()
    total_sales = Sale.objects.filter(sale_date__gte=timezone.now() - timedelta(days=30)).aggregate(
        total=Sum('total_price'))['total'] or 0
    
    recent_movements = StockMovement.objects.select_related('product').order_by('-created_at')[:5]
    low_stock_items = Product.objects.filter(quantity__lte=F('reorder_level')).select_related('category', 'supplier')
    
    context = {
        'total_products': total_products,
        'low_stock_products': low_stock_products,
        'total_sales': total_sales,
        'recent_movements': recent_movements,
        'low_stock_items': low_stock_items,
    }
    return render(request, 'core/dashboard.html', context)

@login_required
def product_list(request):
    products = Product.objects.select_related('category', 'supplier').all()
    return render(request, 'core/product_list.html', {'products': products})

@login_required
def product_detail(request, pk):
    product = get_object_or_404(Product.objects.select_related('category', 'supplier'), pk=pk)
    movements = product.movements.all().order_by('-created_at')[:10]
    sales = product.sales.all().order_by('-sale_date')[:10]
    return render(request, 'core/product_detail.html', {
        'product': product,
        'movements': movements,
        'sales': sales
    })

@login_required
def product_create(request):
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save()
            messages.success(request, 'Product created successfully.')
            return redirect('product_detail', pk=product.pk)
    else:
        form = ProductForm()
    return render(request, 'core/product_form.html', {'form': form, 'title': 'Add Product'})

@login_required
def product_edit(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            messages.success(request, 'Product updated successfully.')
            return redirect('product_detail', pk=product.pk)
    else:
        form = ProductForm(instance=product)
    return render(request, 'core/product_form.html', {'form': form, 'title': 'Edit Product'})

@login_required
def stock_movement_create(request):
    if request.method == 'POST':
        form = StockMovementForm(request.POST)
        if form.is_valid():
            movement = form.save(commit=False)
            movement.created_by = request.user
            movement.save()
            messages.success(request, 'Stock movement recorded successfully.')
            return redirect('product_detail', pk=movement.product.pk)
    else:
        form = StockMovementForm()
    return render(request, 'core/stock_movement_form.html', {'form': form})

@login_required
def sale_create(request):
    if request.method == 'POST':
        form = SaleForm(request.POST)
        if form.is_valid():
            sale = form.save(commit=False)
            sale.created_by = request.user
            sale.save()
            messages.success(request, 'Sale recorded successfully.')
            return redirect('product_detail', pk=sale.product.pk)
    else:
        form = SaleForm()
    return render(request, 'core/sale_form.html', {'form': form})

@login_required
def category_list(request):
    categories = Category.objects.all()
    return render(request, 'core/category_list.html', {'categories': categories})

@login_required
def supplier_list(request):
    suppliers = Supplier.objects.all()
    return render(request, 'core/supplier_list.html', {'suppliers': suppliers})

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filterset_fields = ['name']
    search_fields = ['name', 'description']
    permission_classes = [permissions.AllowAny]

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    filterset_fields = ['name']
    search_fields = ['name', 'contact_person', 'email', 'phone']
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filterset_fields = ['category', 'supplier', 'price']
    search_fields = ['name', 'description', 'sku']
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        low_stock_products = self.queryset.filter(quantity__lte=F('reorder_level'))
        serializer = self.get_serializer(low_stock_products, many=True)
        return Response(serializer.data)

class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    filterset_fields = ['movement_type', 'product', 'created_at']
    search_fields = ['product__name', 'reference_number', 'notes']
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        movement = serializer.save()
        product = movement.product
        if movement.movement_type == 'IN':
            product.quantity += movement.quantity
        elif movement.movement_type == 'OUT':
            product.quantity -= movement.quantity
        product.save()

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    filterset_fields = ['product', 'sale_date']
    search_fields = ['product__name']
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        sale = serializer.save()
        product = sale.product
        product.quantity -= sale.quantity
        product.save()

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    def list(self, request):
        # Get counts
        total_products = Product.objects.count()
        total_categories = Category.objects.count()
        total_suppliers = Supplier.objects.count()
        low_stock_products = Product.objects.filter(quantity__lte=F('reorder_level')).count()

        # Get sales data
        total_sales = Sale.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        recent_sales = Sale.objects.order_by('-sale_date')[:5]
        recent_movements = StockMovement.objects.order_by('-created_at')[:5]

        data = {
            'total_products': total_products,
            'total_categories': total_categories,
            'total_suppliers': total_suppliers,
            'low_stock_products': low_stock_products,
            'total_sales': total_sales,
            'recent_sales': recent_sales,
            'recent_movements': recent_movements,
        }

        serializer = DashboardSerializer(data)
        return Response(serializer.data) 
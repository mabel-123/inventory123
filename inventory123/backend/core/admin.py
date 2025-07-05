from django.contrib import admin
from .models import Category, Supplier, Product, StockMovement, Sale

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at', 'updated_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at', 'updated_at')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_person', 'email', 'phone', 'created_at', 'updated_at')
    search_fields = ('name', 'contact_person', 'email', 'phone')
    list_filter = ('created_at', 'updated_at')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'supplier', 'sku', 'price', 'quantity', 'reorder_level', 'created_at', 'updated_at')
    list_filter = ('category', 'supplier', 'created_at', 'updated_at')
    search_fields = ('name', 'description', 'sku')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('product', 'movement_type', 'quantity', 'reference_number', 'created_by', 'created_at')
    list_filter = ('movement_type', 'created_at', 'created_by')
    search_fields = ('product__name', 'reference_number', 'notes')
    readonly_fields = ('created_at',)

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('product', 'quantity', 'unit_price', 'total_amount', 'sale_date', 'created_by', 'created_at')
    list_filter = ('sale_date', 'created_by', 'created_at')
    search_fields = ('product__name',)
    readonly_fields = ('total_amount', 'created_at') 
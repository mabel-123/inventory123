from django import forms
from .models import Product, Category, Supplier, StockMovement, Sale

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'description', 'category', 'supplier', 'sku', 'price', 
                 'quantity', 'reorder_level', 'image']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name', 'description']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }

class SupplierForm(forms.ModelForm):
    class Meta:
        model = Supplier
        fields = ['name', 'contact_person', 'email', 'phone', 'address']
        widgets = {
            'address': forms.Textarea(attrs={'rows': 3}),
        }

class StockMovementForm(forms.ModelForm):
    class Meta:
        model = StockMovement
        fields = ['product', 'movement_type', 'quantity', 'reference_number', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 3}),
        }

    def clean(self):
        cleaned_data = super().clean()
        product = cleaned_data.get('product')
        quantity = cleaned_data.get('quantity')
        movement_type = cleaned_data.get('movement_type')

        if product and quantity and movement_type:
            if movement_type == 'OUT' and quantity > product.quantity:
                raise forms.ValidationError(
                    f"Cannot remove {quantity} items. Only {product.quantity} available."
                )
        return cleaned_data

class SaleForm(forms.ModelForm):
    class Meta:
        model = Sale
        fields = ['product', 'quantity']

    def clean(self):
        cleaned_data = super().clean()
        product = cleaned_data.get('product')
        quantity = cleaned_data.get('quantity')

        if product and quantity:
            if quantity > product.quantity:
                raise forms.ValidationError(
                    f"Cannot sell {quantity} items. Only {product.quantity} available."
                )
            cleaned_data['total_price'] = product.price * quantity
        return cleaned_data 
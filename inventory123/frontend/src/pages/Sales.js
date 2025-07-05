import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  fetchSales,
  createSale,
  updateSale,
  deleteSale,
} from '../store/slices/saleSlice';
import { fetchProducts } from '../store/slices/productSlice';

function Sales() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.sales);
  const { items: products } = useSelector((state) => state.products);
  const [open, setOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    unit_price: '',
    sale_date: '',
  });

  useEffect(() => {
    dispatch(fetchSales());
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpen = (sale = null) => {
    if (sale) {
      setSelectedSale(sale);
      setFormData({
        product: sale.product,
        quantity: sale.quantity,
        unit_price: sale.unit_price,
        sale_date: sale.sale_date ? sale.sale_date.substring(0, 16) : '',
      });
    } else {
      setSelectedSale(null);
      setFormData({
        product: '',
        quantity: '',
        unit_price: '',
        sale_date: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSale(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      quantity: Number(formData.quantity),
      unit_price: Number(formData.unit_price),
      sale_date: formData.sale_date,
    };
    if (selectedSale) {
      dispatch(updateSale({ id: selectedSale.id, ...data }));
    } else {
      dispatch(createSale(data));
    }
    handleClose();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      dispatch(deleteSale(id));
    }
  };

  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      width: 200,
      valueGetter: (params) => {
        const prod = products.find((p) => p.id === params.row.product);
        return prod ? prod.name : params.row.product_name || '';
      },
    },
    { field: 'quantity', headerName: 'Quantity', width: 120, type: 'number' },
    { field: 'unit_price', headerName: 'Unit Price', width: 120, type: 'number' },
    { field: 'total_amount', headerName: 'Total', width: 120, type: 'number' },
    { field: 'sale_date', headerName: 'Sale Date', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpen(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Sales</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Sale
        </Button>
      </Box>

      <DataGrid
        rows={items}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedSale ? 'Edit Sale' : 'Add Sale'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              select
              fullWidth
              label="Product"
              name="product"
              value={formData.product}
              onChange={(e) =>
                setFormData({ ...formData, product: e.target.value })
              }
              margin="normal"
              required
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Unit Price"
              name="unit_price"
              type="number"
              value={formData.unit_price}
              onChange={(e) =>
                setFormData({ ...formData, unit_price: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Sale Date"
              name="sale_date"
              type="datetime-local"
              value={formData.sale_date}
              onChange={(e) =>
                setFormData({ ...formData, sale_date: e.target.value })
              }
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedSale ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Sales; 
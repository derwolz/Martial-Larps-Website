from django.urls import path , re_path
from . import views
urlpatterns = [
    path('catalog/', views.Catalog.as_view(), name='catalog'),
    path('cart/', views.Cart.as_view(), name='cart'),
    path('product/<int:id>',views.Product.as_view(), name='product'),
]
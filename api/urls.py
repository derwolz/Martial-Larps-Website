from django.urls import path
from . import views

urlpatterns = [
    path('parts/', views.PartList.as_view()),
    path('parts/<int:pk>/', views.PartDetail.as_view()),
    path('products/<str:parts>/', views.ProductListFilter.as_view()),
    path('products/', views.ProductList.as_view()),
    path('products/<int:pk>/', views.ProductDetail.as_view()),
]
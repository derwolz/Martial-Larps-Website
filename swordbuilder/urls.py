from django.urls import path
from . import views
urlpatterns = [
    path('', views.SwordBuilder.as_view(), name='swordbuilder'),
]
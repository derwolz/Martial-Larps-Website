from rest_framework import generics, permissions, filters
from .models import Part, Product
from .serializers import *
# Create your views here.
class PartList(generics.ListAPIView):
    queryset = Part.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = PartSerializer
    
class PartDetail(generics.RetrieveAPIView):
    queryset = Part.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = PartSerializer
    
class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ProductSerializer
    #def list(self, request):
    #    queryset = self.get_queryset()
    #    serializer = UserSerializer(queryset, many=True)
    #    return Response(serializer.data)
class ProductDetail(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = ProductSerializer
    
class ProductListFilter(generics.ListAPIView):
    #def __init__(self, *args, **kwargs):
    #queryset = Product.objects.all()  
    #self.fields['^part'].queryset = Product.objects.filter(
    serializer_class = ProductSerializer
    
    
    #search_fields = ['^part_type']
    def get_queryset(self):
        #prequery = Part.objects.all()
        #for backend in list(self.filter_backends):
        #    queryset = backend().filter_queryset(self.request, queryset, self)
        _part_type =  self.kwargs['parts']
        queryset = Product.objects.filter(part__part_type=_part_type)
        return queryset

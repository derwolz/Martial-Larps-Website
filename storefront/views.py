from django.shortcuts import render, get_object_or_404
from django.views import View
from api.models import Product as ProductModels
from api.models import Review
from api.forms import *
import re
# Create your views here.
class Catalog(View):
    def minimizebuttons(self,buttons, currpage):
            _list=[]
            for button in buttons:
                if button== '<<' or button == '>>' or (button > currpage -2 and button < currpage +2):
                    _list.append(button)
            return _list
    
    def get(self, request, *args, **kwargs):
        maxbuttons = 8
        # context = products min and max search multiple choice form type
        products = ProductModels.objects.all()
        login = UserForm
        sidebar = SideBarFilterForm
        minimum = 0
        maximum = 206
        numpages =['<<']
        currpage = 1
        for x in range(0,len(products) // (maximum - minimum)):
            numpages.append(str(x+1))
        numpages.append('>>')
        if currpage==1:
            numpages.remove('<<')
        elif currpage == len(numpages):
            numpages.remove('>>')
        if len(numpages) > maxbuttons:
            numpages = minimizebuttons(numpages, currpage)
        context = {"products": products[minimum:maximum],"login_form": login, "sidebarform": sidebar, 'numpages': numpages}
        return render(request, 'storefront/catalog.html/', context)
        
        
        
        
class Product(View):
    template_name = 'storefront/product.html/'
    queryset = ProductModels.objects.all()
    def get(self, request, *args, **kwargs):
        url_id = self.kwargs.get("id")
        target = self.queryset.get(id=url_id)
        reviews = Review.objects.all().filter(product=target)
        login = UserForm
        context = {'login_form': login,'product':target, 'reviews':reviews}
        return render(request, 'storefront/product.html/', context)
        
class Cart(View):
    def get(self, request, *args, **kwargs):
        context = {}
        return render(request, 'storefront/cart.html/', context)
        

    
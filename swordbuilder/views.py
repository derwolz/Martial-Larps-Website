from django.shortcuts import render
from django.views import View
from api.forms import UserForm


# Create your views here.
class SwordBuilder(View):

    def get(self, request):
        login = UserForm
        context = {'login_form': login}
        return render(request, 'swordbuilder/index.html', context)
        
        
         

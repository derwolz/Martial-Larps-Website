from django.shortcuts import render
from django.views import View
from api.forms import *
# Create your views here.
class Index(View):
    def get(self, request):
        login=UserForm
        context = {"login_form": login}
        return render(request, 'landingpage/index.html', context)
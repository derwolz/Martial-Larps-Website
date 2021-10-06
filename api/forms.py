from django import forms
from .models import *
class UserForm(forms.Form):
    name = forms.CharField(required=True, max_length=256)
    email = forms.CharField(required=True, max_length=256)
class SideBarFilterForm(forms.Form):
    _filters = Part.PartTypes
    _list = tuple(_filters)
    _reviews = (
    ('1', '1+'),
    ('2', '2+'),
    ('3', '3+'),
    ('4', '4+'),
    ('5', '5'),
    )
    filter_part_type = forms.MultipleChoiceField(
        choices=_list, widget=forms.CheckboxSelectMultiple(
        attrs={}))
    min_price = forms.IntegerField(required=False)
    max_price = forms.IntegerField(required=False)

    Reviews = forms.ChoiceField(choices = _reviews)
class ReviewForm(forms.Form):
    pass
#    filters = Categories.objects.all()
    
#class FilterForm(forms.Form):
#    def __init__(self, *args, **kwargs):
#        super().__init__(*args, **kwargs)
        
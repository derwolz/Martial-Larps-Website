from rest_framework import serializers
from .models import Part, Product

class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = [
            "pk",
            "name",
            "file",
            "part_type",
            
            ]
        extra_kwargs = {
            "product": {"required": False},
            "file": {"required": False},
        }
        
class ProductSerializer(serializers.ModelSerializer):
    parts = PartSerializer(many=False, read_only=True, source="current_part")
    class Meta:
        model = Product
        fields = [
            "pk", 
            "imageURL",
            "part",
            "parts",
            'price',
            
        ]
        extra_kwargs = {
        }
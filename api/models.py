from django.db import models
from django.contrib.auth.models import User

# Create your models here.



class Part(models.Model):
    
    BLAD = "BLAD"
    CROSS = "CROSS"
    GRIP = "GRIP"
    POMM = "POMM"
    PartTypes = [
        (BLAD, 'Blade'),
        (CROSS, 'Crossguard'),
        (GRIP, 'Grip'),
        (POMM, 'Pommel'),
        ]
    name = models.CharField(max_length=128, null=True, blank=True)
    file = models.FileField(max_length=256)
    part_type = models.CharField(
        max_length=12,
        choices=PartTypes,
        default=BLAD,
    )
    def __str__(self):
        return str(self.name)
    def getType(self):
        return str(self.part_type)
    def fileURL(self):
        try:
            url = self.file.url
        except:
            url = ''
        return url


class Product(models.Model):
    
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(null=True, blank=True)
    description = models.CharField(max_length=1024, null=True, blank=True)
    part = models.ForeignKey(Part, on_delete=models.SET_NULL, blank=True, null=True)
    def __str__(self):
        return (self.part.name)
    @property
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = ''
        return url
    @property
    def aggregateReviews(self):
        reviews = self.review_set.all()
        
        total = sum([review.rating for review in reviews])
        if len(reviews) > 0:
            total /= len(reviews)
        else:
            total = -1
        return total
    @property
    def getImages(self):
        return self.productimage_set.all()
    @property
    def part_type(self):
        return self.part.part_type
        
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=256, null=True)
    email = models.CharField(max_length=256, null=True)
    def __str__(self):
        return self.name
        
class Review(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1)
    review = models.CharField(max_length=2048, null=True, blank=True)
    def __str__(self): 
        return str(self.product) + ": " + str(self.customer)

    
class ProductImage(models.Model):
    name = models.CharField(max_length=256, null=True)
    image = models.ImageField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True)
    @property 
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = ''
        return url
        
class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    is_complete = models.BooleanField(default=False, null=True, blank=False)
    transaction_id = models.CharField(max_length=200, null=True)
    def __str__(self):
        return str(self.id)
    @property
    def shipping(self):
        shipping = False
        orderitems = self.orderitem_set.all()
        for i in orderitems:
            shipping = True
        return shipping
    @property
    def get_cart_total(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.get_total for item in orderitems])
        return total
    @property
    def get_cart_items(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.quantity for item in orderitems])
        return total

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.product)
    @property
    def get_total(self):
        total = self.product.price * self.quantity
        return total

class Shipment(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    address = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    state = models.CharField(max_length=128)
    country = models.CharField(max_length=128)
    zipcode = models.CharField(max_length=16)
    date_added = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.address)
        
################## 3D RENDER MODELS #####################
#from storefront.models import Product


    
class Sword(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, blank=True, null=True)
    buildId = models.CharField(max_length=128, null=True)
    def __str__(self):
        return 'Custom Sword'
    @property
    def get_cost_total(self):
        sumation = 0.0
        items = self.BuildPart_set.all()
        return sum([ item.part.price for item in items])
    @property
    def add_to_order(self):
        items = self.buildparts_set.all()
        for item in items:
            pass
        
class BuildPart(models.Model):
    part = models.ForeignKey(Part, on_delete=models.SET_NULL, blank=True, null=True)
    build = models.ForeignKey(Sword, on_delete=models.SET_NULL, blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.build.buildId +": " + str(self.part))
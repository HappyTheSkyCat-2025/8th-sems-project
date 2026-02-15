class UserInteraction(models.Model):
    user = ForeignKey(User)
    travel_deal = ForeignKey(TravelDeal)
    interaction_type = CharField(  # 'view', 'click', 'filter', 'search'
        choices=[('view', 'View'), ('click', 'Click'), ('add_to_wishlist', 'Wishlist')]
    )
    timestamp = DateTimeField(auto_now_add=True)
    duration = IntegerField(null=True)  # seconds viewed
    
    class Meta:
        indexes = [['user', 'timestamp'], ['travel_deal', 'timestamp']]
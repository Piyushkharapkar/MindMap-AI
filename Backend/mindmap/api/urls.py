from django.urls import path
from .views import generate_mindmap_view

urlpatterns = [
    path("generate/", generate_mindmap_view, name="generate_mindmap"),
]

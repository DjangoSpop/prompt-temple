#!/usr/bin/env python3
"""
Django Backend Setup Script for Prompt Optimization Platform
This script helps set up the Django backend with WebSocket support,
LangChain integration, and vector database for prompt optimization.
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors."""
    print(f"\n🔧 {description}")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ Success: {description}")
        if result.stdout:
            print(f"Output: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {description}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    """Main setup function."""
    
    print("🚀 Django Backend Setup for Prompt Optimization Platform")
    print("=" * 60)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print("\n📋 Next Steps:")
    print("1. Update the .env file with your API keys and database credentials")
    print("2. Install PostgreSQL and Redis, or use Docker: docker-compose up -d db redis")
    print("3. Run migrations: python manage.py migrate")
    print("4. Create superuser: python manage.py createsuperuser")
    print("5. Start the development server: python manage.py runserver")
    print("6. Start WebSocket server: python manage.py run_websocket_server")
    print("7. Start Celery worker: celery -A promptcraft_backend worker -l info")
    print("\n🔗 The backend will be available at:")
    print("   - HTTP API: http://localhost:8000")
    print("   - WebSocket: ws://localhost:8001")
    print("   - Admin: http://localhost:8000/admin")

if __name__ == "__main__":
    main()
'''

def create_model_files():
    """Create Django model files for prompt optimization."""
    
    # Prompts models
    prompts_models = '''
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MaxLengthValidator
import uuid
import json

class TemplateCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Template Categories'

    def __str__(self):
        return self.name

    @property
    def template_count(self):
        return self.prompttemplate_set.filter(is_public=True).count()

class PromptTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200, validators=[MinLengthValidator(3)])
    description = models.TextField()
    template_content = models.TextField(validators=[MinLengthValidator(10), MaxLengthValidator(8000)])
    category = models.ForeignKey(TemplateCategory, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    
    # Version control
    version = models.CharField(max_length=20, default='1.0')
    parent_template = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    
    # Metadata
    tags = models.JSONField(default=list, blank=True)
    variables = models.JSONField(default=list, blank=True)  # Template variables
    
    # AI Enhancement
    is_ai_generated = models.BooleanField(default=False)
    ai_confidence = models.FloatField(null=True, blank=True)
    extracted_keywords = models.JSONField(default=list, blank=True)
    smart_suggestions = models.JSONField(default=list, blank=True)
    
    # Vector embeddings for similarity search
    embedding_vector = models.JSONField(null=True, blank=True)
    embedding_model = models.CharField(max_length=100, blank=True)
    
    # Usage statistics
    usage_count = models.IntegerField(default=0)
    completion_rate = models.FloatField(default=0.0)  # Success rate
    average_rating = models.FloatField(default=0.0)
    popularity_score = models.FloatField(default=0.0)
    
    # Status
    is_public = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Localization
    language = models.CharField(max_length=10, default='en')
    localizations = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-popularity_score', '-usage_count', '-created_at']
        indexes = [
            models.Index(fields=['category', 'is_public']),
            models.Index(fields=['author', 'created_at']),
            models.Index(fields=['popularity_score']),
            models.Index(fields=['usage_count']),
            models.Index(fields=['is_featured', 'is_public']),
        ]

    def __str__(self):
        return self.title

    @property
    def field_count(self):
        return len(self.variables)

    def update_popularity_score(self):
        """Calculate and update popularity score based on various metrics."""
        # Weight factors
        usage_weight = 0.4
        rating_weight = 0.3
        completion_weight = 0.2
        recency_weight = 0.1
        
        # Normalize usage count (log scale for large numbers)
        import math
        normalized_usage = math.log(self.usage_count + 1) / math.log(1000)  # Scale to 1000 max
        
        # Recency factor (newer templates get slight boost)
        from django.utils import timezone
        days_old = (timezone.now() - self.created_at).days
        recency_factor = max(0, 1 - days_old / 365)  # Decay over a year
        
        self.popularity_score = (
            normalized_usage * usage_weight +
            (self.average_rating / 5.0) * rating_weight +
            self.completion_rate * completion_weight +
            recency_factor * recency_weight
        ) * 100
        
        self.save(update_fields=['popularity_score'])

class PromptField(models.Model):
    FIELD_TYPES = [
        ('text', 'Text Input'),
        ('textarea', 'Text Area'),
        ('dropdown', 'Dropdown'),
        ('checkbox', 'Checkbox'),
        ('radio', 'Radio Button'),
        ('number', 'Number'),
        ('email', 'Email'),
        ('url', 'URL'),
        ('date', 'Date'),
        ('file', 'File Upload'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template = models.ForeignKey(PromptTemplate, on_delete=models.CASCADE, related_name='fields')
    label = models.CharField(max_length=100)
    placeholder = models.CharField(max_length=200, blank=True)
    field_type = models.CharField(max_length=20, choices=FIELD_TYPES, default='text')
    is_required = models.BooleanField(default=True)
    default_value = models.CharField(max_length=500, blank=True)
    validation_pattern = models.CharField(max_length=200, blank=True)  # Regex pattern
    help_text = models.CharField(max_length=200, blank=True)
    options = models.JSONField(default=list, blank=True)  # For dropdown/radio options
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return f"{self.template.title} - {self.label}"

class PromptUsage(models.Model):
    """Track template usage for analytics."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    template = models.ForeignKey(PromptTemplate, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_id = models.CharField(max_length=100, blank=True)
    
    # Usage details
    filled_variables = models.JSONField(default=dict)
    generated_prompt = models.TextField()
    completion_time = models.FloatField()  # Time to complete in seconds
    was_successful = models.BooleanField(default=True)
    user_rating = models.IntegerField(null=True, blank=True, choices=[(i, i) for i in range(1, 6)])
    feedback = models.TextField(blank=True)
    
    # Context
    user_agent = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    referrer = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['template', 'created_at']),
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['was_successful']),
        ]

    def __str__(self):
        return f"Usage of {self.template.title} by {self.user or 'Anonymous'}"
'''
    
    with open('prompts/models.py', 'w') as f:
        f.write(prompts_models)
    
    print("✅ Created prompts models")

if __name__ == "__main__":
    main()

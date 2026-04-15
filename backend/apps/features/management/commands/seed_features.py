import random

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.features.models import FeatureRequest, Vote

User = get_user_model()

FEATURES = [
    {
        "title": "Dark mode support",
        "description": "Add a system-wide dark mode toggle that respects OS preferences. "
        "Many users work late at night and a dark theme would reduce eye strain significantly.",
    },
    {
        "title": "Export data to CSV",
        "description": "Allow users to export their feature requests and vote history as CSV files "
        "for offline analysis and reporting purposes.",
    },
    {
        "title": "Email notifications for status changes",
        "description": "Send email notifications when a feature request you voted on "
        "changes status. This keeps users engaged and informed about progress.",
    },
    {
        "title": "Markdown support in descriptions",
        "description": "Enable markdown formatting in feature request descriptions so users can "
        "add code blocks, links, lists, and other rich formatting to better explain their ideas.",
    },
    {
        "title": "Comment threads on feature requests",
        "description": "Allow users to discuss feature requests through threaded comments. "
        "This enables collaborative refinement of ideas and helps clarify requirements.",
    },
    {
        "title": "Tags and categories for features",
        "description": "Add the ability to tag feature requests with categories like UI, API, "
        "Performance, etc. This makes it easier to filter and find related requests.",
    },
    {
        "title": "Public roadmap view",
        "description": "Create a public-facing roadmap that shows planned, in-progress, and "
        "completed features in a timeline or kanban board format.",
    },
    {
        "title": "Keyboard shortcuts",
        "description": "Add keyboard shortcuts for common actions like upvoting (u), "
        "navigating between features (j/k), and submitting new requests (n).",
    },
    {
        "title": "OAuth social login",
        "description": "Support login via Google and GitHub OAuth to reduce friction "
        "for new users signing up. Many developer tools already support this.",
    },
    {
        "title": "API rate limiting dashboard",
        "description": "Show users their current API usage and rate limit status in "
        "a dedicated dashboard so they can monitor and plan their integrations.",
    },
]


class Command(BaseCommand):
    help = "Seed the database with sample users, feature requests, and votes"

    def handle(self, *args, **options):
        test_user, created = User.objects.get_or_create(
            email="test@example.com",
            defaults={
                "username": "testuser",
                "first_name": "Test",
                "last_name": "User",
            },
        )
        if created:
            test_user.set_password("testpass123")
            test_user.save()
            self.stdout.write(
                self.style.SUCCESS("Created test user: test@example.com / testpass123")
            )
        else:
            self.stdout.write("Test user already exists.")

        extra_users = []
        for i in range(1, 4):
            user, created = User.objects.get_or_create(
                email=f"user{i}@example.com",
                defaults={
                    "username": f"user{i}",
                    "first_name": "User",
                    "last_name": str(i),
                },
            )
            if created:
                user.set_password("testpass123")
                user.save()
            extra_users.append(user)

        all_users = [test_user] + extra_users

        for feature_data in FEATURES:
            feature, created = FeatureRequest.objects.get_or_create(
                title=feature_data["title"],
                defaults={
                    "description": feature_data["description"],
                    "created_by": random.choice(all_users),
                },
            )
            if created:
                voters = random.sample(all_users, k=random.randint(0, len(all_users)))
                for voter in voters:
                    Vote.objects.get_or_create(user=voter, feature_request=feature)
                feature.update_vote_count()
                self.stdout.write(f"  Created: {feature.title} ({feature.vote_count} votes)")

        self.stdout.write(
            self.style.SUCCESS(f"\nDone! {FeatureRequest.objects.count()} features in database.")
        )

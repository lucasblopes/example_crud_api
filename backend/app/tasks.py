import time
from celery import shared_task
from django.db.models import Avg, StdDev
from .models import Person


@shared_task(bind=True)
def long_running_task(self):
    """
    Simulates a long-running job and calculates statistics.

    bind=True allows access to task state via self
    """
    time.sleep(5)
    # Perform the calculation in the database.
    stats = Person.objects.aggregate(avg_age=Avg("age"), std_dev_age=StdDev("age"))
    return {
        "status": "completed",
        "average_age": stats["avg_age"] or 0,
        "std_dev_age": stats["std_dev_age"] or 0,
    }

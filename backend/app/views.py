from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from celery.result import AsyncResult
from django.utils.dateparse import parse_date

from .models import Person
from .serializers import PersonSerializer
from .tasks import long_running_task


class PersonViewSet(viewsets.ModelViewSet):
    """
    CRUD API for Person with pagination.
      Provides CRUD operations:
      - POST   /api/persons/      -> 201 Created
      - GET    /api/persons/      -> 200 OK
      - GET    /api/persons/{id}/ -> 200 OK
      - PATCH  /api/persons/{id}/ -> 200 OK
      - DELETE /api/persons/{id}/ -> 204 No Content
    """

    def get_queryset(self):
        """
        Allows to filter by date.
        Ex: /api/persons/?start_date=2024-01-01&end_date=2024-12-31
        """
        queryset = Person.objects.all().order_by("-created_date")

        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date:
            queryset = queryset.filter(created_date__date__gte=parse_date(start_date))

        if end_date:
            queryset = queryset.filter(created_date__date__lte=parse_date(end_date))

        return queryset

    serializer_class = PersonSerializer


class LongTaskStartView(APIView):
    """
    Starts an async Celery task.

    return Response(
        {
          "task_id": task.id,
          "status": "accepted"
        },
        status=status.HTTP_202_ACCEPTED
      )
    """

    def post(self, request):
        task = long_running_task.delay()

        return Response(
            {"task_id": task.id, "status": "accepted"}, status=status.HTTP_202_ACCEPTED
        )


class LongTaskStatusView(APIView):
    """
    Polling endpoint for async task.


    property state

      The tasks current state.

      Possible values includes:

          PENDING

              The task is waiting for execution.

          STARTED

              The task has been started.

          RETRY

              The task is to be retried, possibly because of failure.

          FAILURE

              The task raised an exception, or has exceeded the retry limit. The result attribute then contains the exception raised by the task.

          SUCCESS

              The task executed successfully. The result attribute then contains the tasks return value.

    return Response(
        {
          "task_id": task_id,
          "state": result.state,
          "result": result.result if result.successful() else None
        },
        status=status.HTTP_200_OK
      )
    """

    def get(self, request, task_id):
        result = AsyncResult(str(task_id))

        return Response(
            {
                "task_id": str(task_id),
                "state": result.state,
                "result": result.result if result.successful() else None,
            },
            status=status.HTTP_200_OK,
        )

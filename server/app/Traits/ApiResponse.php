<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    /**
     * Return a standardized success JSON response.
     *
     * @param mixed $data
     * @param string $message
     * @param int $statusCode
     * @param array $meta
     * @return JsonResponse
     */
    public function successResponse(
        mixed $data = null,
        string $message = 'Opération réussie',
        int $statusCode = Response::HTTP_OK,
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a standardized created (201) JSON response.
     *
     * @param mixed $data
     * @param string $message
     * @return JsonResponse
     */
    public function createdResponse(
        mixed $data = null,
        string $message = 'Ressource créée avec succès'
    ): JsonResponse {
        return $this->successResponse($data, $message, Response::HTTP_CREATED);
    }

    /**
     * Return a standardized error JSON response.
     *
     * @param string $message
     * @param int $statusCode
     * @param mixed $errors
     * @param string|null $errorCode
     * @return JsonResponse
     */
    public function errorResponse(
        string $message = 'Une erreur est survenue',
        int $statusCode = Response::HTTP_BAD_REQUEST,
        mixed $errors = null,
        ?string $errorCode = null
    ): JsonResponse {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $response['errors'] = $errors;
        }

        if ($errorCode !== null) {
            $response['error_code'] = $errorCode;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a standardized paginated response.
     *
     * @param LengthAwarePaginator $paginator
     * @param string $message
     * @return JsonResponse
     */
    public function paginatedResponse(
        LengthAwarePaginator $paginator,
        string $message = 'Liste récupérée avec succès'
    ): JsonResponse {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'has_more' => $paginator->hasMorePages(),
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Return a 404 Not Found response.
     *
     * @param string $message
     * @return JsonResponse
     */
    public function notFoundResponse(string $message = 'Ressource introuvable'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_NOT_FOUND, null, 'RESOURCE_NOT_FOUND');
    }

    /**
     * Return a 401 Unauthorized response.
     *
     * @param string $message
     * @return JsonResponse
     */
    public function unauthorizedResponse(string $message = 'Non authentifié'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_UNAUTHORIZED, null, 'UNAUTHENTICATED');
    }

    /**
     * Return a 403 Forbidden response.
     *
     * @param string $message
     * @return JsonResponse
     */
    public function forbiddenResponse(string $message = 'Action non autorisée'): JsonResponse
    {
        return $this->errorResponse($message, Response::HTTP_FORBIDDEN, null, 'FORBIDDEN');
    }

    /**
     * Return a 204 No Content response.
     *
     * @return JsonResponse
     */
    public function noContentResponse(): JsonResponse
    {
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}

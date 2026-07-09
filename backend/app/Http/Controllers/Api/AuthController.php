<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // POST
    public function login(Request $request): JsonResponse
    {
        $credenciais = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!$token = auth('api')->attempt($credenciais)) {

            return response()->json([
                'message' => 'Credenciais inválidas.'
            ], 401);

        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth('api')->user(),
        ]);
    }

    // POST
    public function logout(): JsonResponse
    {
        auth('api')->logout();

        return response()->json([
            'message' => 'Logout realizado.'
        ]);
    }

    // GET /me
    public function me(): JsonResponse
    {
        return response()->json(auth('api')->user());
    }

    public function refresh(): JsonResponse
    {
        return response()->json([
            'access_token' => auth()->refresh(),
            'token_type' => 'Bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }
}

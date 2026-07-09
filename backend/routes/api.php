<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\OrgaoController;
use App\Http\Controllers\Api\OrcamentoController;
use App\Http\Controllers\Api\ContratoController;
use App\Http\Controllers\Api\GraficoController;


// Rotas públicas

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});


// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index']);

// Órgãos
Route::get('/orgaos', [OrgaoController::class, 'index']);
Route::get('/orgaos/{id}', [OrgaoController::class, 'show']);

// Orçamentos
Route::get('/orcamentos', [OrcamentoController::class, 'index']);
Route::get('/orcamentos/{id}', [OrcamentoController::class, 'show']);

// Contratos
Route::get('/contratos', [ContratoController::class, 'index']);

// Gráficos
Route::get('/graficos', [GraficoController::class, 'index']);



// Rotas protegidas por JWT
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::patch('/orcamentos/{id}/revisao', [OrcamentoController::class, 'revisao']);
});
{
  "openapi": "3.1.0",
  "info": {
    "title": "Hotel Link",
    "version": "0.1.0"
  },
  "paths": {
    "/api/v1/utils/health-check/": {
      "get": {
        "tags": [
          "utils"
        ],
        "summary": "Health Check",
        "description": "Health check endpoint",
        "operationId": "utils-health_check",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/v1/utils/test": {
      "get": {
        "tags": [
          "utils"
        ],
        "summary": "Test Endpoint",
        "description": "Test endpoint",
        "operationId": "utils-test_endpoint",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/login": {
      "post": {
        "tags": [
          "auth"
        ],
        "summary": "Login",
        "description": "Login endpoint with username/password authentication\n\nPOST /api/v1/auth/login\nForm data:\n- username: admin@travel.link360.vn  \n- password: admin123\n\nBackend automatically finds the correct tenant for the user\nReturns access token for external apps to use",
        "operationId": "auth-login",
        "requestBody": {
          "content": {
            "application/x-www-form-urlencoded": {
              "schema": {
                "$ref": "#/components/schemas/Body_auth-login"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/auto-token": {
      "get": {
        "tags": [
          "auth"
        ],
        "summary": "Auto Generate Token For Docs",
        "description": "Auto-generate token for API docs \"Authorize\" button\nThis saves token to localStorage for external apps to use",
        "operationId": "auth-auto_generate_token_for_docs",
        "parameters": [
          {
            "name": "tenant_code",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "default": "demo",
              "title": "Tenant Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Token"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/auth/logout": {
      "post": {
        "tags": [
          "auth"
        ],
        "summary": "Logout",
        "description": "Logout endpoint - logs the logout activity\n\nPOST /api/v1/auth/logout\nRequires valid authentication token",
        "operationId": "auth-logout",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        },
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ]
      }
    },
    "/api/v1/activity-logs/": {
      "get": {
        "tags": [
          "activity-logs"
        ],
        "summary": "Get Activity Logs",
        "description": "Get recent activity logs for the current user's tenant or specified tenant.\n\nReturns the most recent logs ordered by created_at DESC.\nSupports filtering by activity_type and date range.",
        "operationId": "activity-logs-get_activity_logs",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Filter by tenant ID",
              "title": "Tenant Id"
            },
            "description": "Filter by tenant ID"
          },
          {
            "name": "activity_type",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/ActivityType"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Filter by activity type",
              "title": "Activity Type"
            },
            "description": "Filter by activity type"
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "maximum": 200,
              "description": "Number of logs to return",
              "default": 50,
              "title": "Limit"
            },
            "description": "Number of logs to return"
          },
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Filter logs from last N days",
              "title": "Days"
            },
            "description": "Filter logs from last N days"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ActivityLogResponse"
                  },
                  "title": "Response Activity-Logs-Get Activity Logs"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/activity-logs/seed": {
      "post": {
        "tags": [
          "activity-logs"
        ],
        "summary": "Seed Sample Activities",
        "description": "Seed sample activity data for testing purposes.\nOnly available in development mode.",
        "operationId": "activity-logs-seed_sample_activities",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "count",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "maximum": 50,
              "description": "Number of sample activities to create",
              "default": 20,
              "title": "Count"
            },
            "description": "Number of sample activities to create"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/activity-logs/test-simple": {
      "get": {
        "tags": [
          "activity-logs"
        ],
        "summary": "Test Simple",
        "description": "Test endpoint without parameters",
        "operationId": "activity-logs-test_simple",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/v1/activity-logs/public": {
      "get": {
        "tags": [
          "activity-logs"
        ],
        "summary": "Get Activity Logs Public",
        "description": "Public endpoint to get activity logs from database.\nNo authentication required for testing.",
        "operationId": "activity-logs-get_activity_logs_public",
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 10,
              "title": "Limit"
            }
          },
          {
            "name": "tenant_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 1,
              "title": "Tenant Id"
            }
          },
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Days"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/activity-logs/public/seed": {
      "post": {
        "tags": [
          "activity-logs"
        ],
        "summary": "Seed Sample Activities Public",
        "description": "Public endpoint to seed sample activity data for testing purposes.\nNo authentication required.",
        "operationId": "activity-logs-seed_sample_activities_public",
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "description": "Tenant ID (default: 1)",
              "default": 1,
              "title": "Tenant Id"
            },
            "description": "Tenant ID (default: 1)"
          },
          {
            "name": "count",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "maximum": 30,
              "description": "Number of sample activities to create",
              "default": 10,
              "title": "Count"
            },
            "description": "Number of sample activities to create"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/activity-test/": {
      "get": {
        "tags": [
          "activity-test"
        ],
        "summary": "Get Activities",
        "description": "Simple endpoint to get activity logs from database",
        "operationId": "activity-test-get_activities",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/v1/plans/": {
      "get": {
        "tags": [
          "plans"
        ],
        "summary": "Read Plans",
        "description": "Retrieve plans. Only superusers can access this.",
        "operationId": "plans-read_plans",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PlanResponse"
                  },
                  "title": "Response Plans-Read Plans"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "plans"
        ],
        "summary": "Create Plan",
        "description": "Create new plan. Only superusers can create plans.",
        "operationId": "plans-create_plan",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PlanCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PlanResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/plans/{plan_id}": {
      "get": {
        "tags": [
          "plans"
        ],
        "summary": "Read Plan",
        "description": "Get plan by ID. Only superusers can access plans.",
        "operationId": "plans-read_plan",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "plan_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Plan Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PlanResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "plans"
        ],
        "summary": "Update Plan",
        "description": "Update a plan. Only superusers can update plans.",
        "operationId": "plans-update_plan",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "plan_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Plan Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PlanUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PlanResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "plans"
        ],
        "summary": "Delete Plan",
        "description": "Delete a plan. Only superusers can delete plans.",
        "operationId": "plans-delete_plan",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "plan_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Plan Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Plans-Delete Plan"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/plans/by-code/{plan_code}": {
      "get": {
        "tags": [
          "plans"
        ],
        "summary": "Read Plan By Code",
        "description": "Get plan by code.",
        "operationId": "plans-read_plan_by_code",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "plan_code",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Plan Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PlanResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/tenants/me/info": {
      "get": {
        "tags": [
          "tenants"
        ],
        "summary": "Read Current Tenant",
        "description": "Get current tenant information.",
        "operationId": "tenants-read_current_tenant",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TenantResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "tenants"
        ],
        "summary": "Update Current Tenant",
        "description": "Update current tenant. Only owners and admins can update tenant settings.",
        "operationId": "tenants-update_current_tenant",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TenantUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TenantResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/tenants/": {
      "get": {
        "tags": [
          "tenants"
        ],
        "summary": "Read Tenants",
        "description": "Retrieve tenants. Only superusers can access this.",
        "operationId": "tenants-read_tenants",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/TenantResponse"
                  },
                  "title": "Response Tenants-Read Tenants"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "tenants"
        ],
        "summary": "Create Tenant",
        "description": "Create new tenant. Only superusers can create tenants.",
        "operationId": "tenants-create_tenant",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TenantCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TenantResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/tenants/{tenant_id}": {
      "put": {
        "tags": [
          "tenants"
        ],
        "summary": "Update Tenant",
        "description": "Update a tenant. Only superusers can update tenants.",
        "operationId": "tenants-update_tenant",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TenantUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TenantResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "get": {
        "tags": [
          "tenants"
        ],
        "summary": "Read Tenant",
        "description": "Get tenant by ID. Superusers can access any tenant, regular users only their own.",
        "operationId": "tenants-read_tenant",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TenantResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "tenants"
        ],
        "summary": "Delete Tenant",
        "description": "Delete a tenant. Only superusers can delete tenants.",
        "operationId": "tenants-delete_tenant",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Tenants-Delete Tenant"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/me": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Read User Me",
        "description": "Get current user.",
        "operationId": "users-read_user_me",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUserResponse"
                }
              }
            }
          }
        },
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ]
      },
      "put": {
        "tags": [
          "users"
        ],
        "summary": "Update User Me",
        "description": "Update own user.",
        "operationId": "users-update_user_me",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AdminUserUpdate"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUserResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ]
      }
    },
    "/api/v1/users/me/password": {
      "put": {
        "tags": [
          "users"
        ],
        "summary": "Update Password Me",
        "description": "Update own password.",
        "operationId": "users-update_password_me",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AdminUserPasswordUpdate"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Users-Update Password Me"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ]
      },
      "patch": {
        "tags": [
          "users"
        ],
        "summary": "Update Password Me Patch",
        "description": "Update own password (PATCH method).",
        "operationId": "users-update_password_me_patch",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AdminUserPasswordUpdate"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Users-Update Password Me Patch"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        },
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ]
      }
    },
    "/api/v1/users/": {
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Read Users",
        "description": "Retrieve users in tenant. Requires admin or owner role.",
        "operationId": "users-read_users",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/AdminUserResponse"
                  },
                  "title": "Response Users-Read Users"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "users"
        ],
        "summary": "Create User",
        "description": "Create new user in tenant. Requires admin or owner role.",
        "operationId": "users-create_user",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AdminUserCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUserResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/{user_id}": {
      "put": {
        "tags": [
          "users"
        ],
        "summary": "Update User",
        "description": "Update a user. Requires admin or owner role.",
        "operationId": "users-update_user",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "User Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/AdminUserUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUserResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "get": {
        "tags": [
          "users"
        ],
        "summary": "Read User",
        "description": "Get a specific user by id.",
        "operationId": "users-read_user",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "User Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AdminUserResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "users"
        ],
        "summary": "Delete User",
        "description": "Delete a user. Owners can delete anyone. Admins can delete editors and viewers.",
        "operationId": "users-delete_user",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "user_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "User Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Users-Delete User"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/properties/": {
      "get": {
        "tags": [
          "properties"
        ],
        "summary": "Read Properties",
        "description": "Retrieve properties in tenant.",
        "operationId": "properties-read_properties",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PropertyResponse"
                  },
                  "title": "Response Properties-Read Properties"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "properties"
        ],
        "summary": "Create Property",
        "description": "Create new property in tenant. Requires admin or owner role.",
        "operationId": "properties-create_property",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/properties/{property_id}": {
      "get": {
        "tags": [
          "properties"
        ],
        "summary": "Read Property",
        "description": "Get property by ID.",
        "operationId": "properties-read_property",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "properties"
        ],
        "summary": "Update Property",
        "description": "Update a property. OWNER, ADMIN, and EDITOR can update properties.",
        "operationId": "properties-update_property",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "properties"
        ],
        "summary": "Delete Property",
        "description": "Delete a property. Only owners can delete properties.",
        "operationId": "properties-delete_property",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Properties-Delete Property"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/properties/by-code/{property_code}": {
      "get": {
        "tags": [
          "properties"
        ],
        "summary": "Read Property By Code",
        "description": "Get property by code.",
        "operationId": "properties-read_property_by_code",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_code",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Property Code"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/categories/": {
      "get": {
        "tags": [
          "categories"
        ],
        "summary": "List Categories",
        "description": "List feature categories - requires authentication",
        "operationId": "categories-list_categories",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Tenant Id"
            }
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FeatureCategoryResponse"
                  },
                  "title": "Response Categories-List Categories"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "categories"
        ],
        "summary": "Create Category",
        "description": "Create new feature category - requires OWNER, ADMIN, or EDITOR role",
        "operationId": "categories-create_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureCategoryCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategoryResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/categories/system": {
      "get": {
        "tags": [
          "categories"
        ],
        "summary": "List System Categories",
        "description": "List system-wide feature categories - requires authentication",
        "operationId": "categories-list_system_categories",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "items": {
                    "$ref": "#/components/schemas/FeatureCategoryResponse"
                  },
                  "type": "array",
                  "title": "Response Categories-List System Categories"
                }
              }
            }
          }
        },
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ]
      }
    },
    "/api/v1/categories/{category_id}": {
      "get": {
        "tags": [
          "categories"
        ],
        "summary": "Get Category",
        "description": "Get feature category by ID - requires authentication",
        "operationId": "categories-get_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategoryResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "categories"
        ],
        "summary": "Update Category",
        "description": "Update feature category - requires OWNER, ADMIN, or EDITOR role",
        "operationId": "categories-update_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/app__schemas__content__FeatureCategoryUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategoryResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "categories"
        ],
        "summary": "Delete Category",
        "description": "Delete feature category - requires OWNER, ADMIN, or EDITOR role",
        "operationId": "categories-delete_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/categories/{category_id}/translations": {
      "get": {
        "tags": [
          "categories"
        ],
        "summary": "Get Category Translations",
        "description": "Get all translations for a category",
        "operationId": "categories-get_category_translations",
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "categories"
        ],
        "summary": "Create Category Translation",
        "description": "Create translation for category",
        "operationId": "categories-create_category_translation",
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/app__schemas__content__FeatureCategoryTranslationCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/categories/{category_id}/translations/{locale}": {
      "put": {
        "tags": [
          "categories"
        ],
        "summary": "Update Category Translation",
        "description": "Update category translation",
        "operationId": "categories-update_category_translation",
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/app__schemas__content__FeatureCategoryTranslationUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/features/categories": {
      "get": {
        "tags": [
          "features"
        ],
        "summary": "Read Feature Categories",
        "description": "Retrieve feature categories for tenant, including system-wide categories.",
        "operationId": "features-read_feature_categories",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "include_system",
            "in": "query",
            "required": false,
            "schema": {
              "type": "boolean",
              "default": true,
              "title": "Include System"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FeatureCategoryResponse"
                  },
                  "title": "Response Features-Read Feature Categories"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/features/categories/": {
      "post": {
        "tags": [
          "features"
        ],
        "summary": "Create Feature Category",
        "description": "Create new feature category. Owners, admins, and editors can create categories.",
        "operationId": "features-create_feature_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureCategoryCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategoryResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/features/categories/{category_id}": {
      "get": {
        "tags": [
          "features"
        ],
        "summary": "Read Feature Category",
        "description": "Get feature category by ID.",
        "operationId": "features-read_feature_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategoryResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "features"
        ],
        "summary": "Update Feature Category",
        "description": "Update feature category. Owners, admins, and editors can update.",
        "operationId": "features-update_feature_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/app__schemas__content__FeatureCategoryUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategoryResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/features/": {
      "get": {
        "tags": [
          "features"
        ],
        "summary": "Read Features",
        "description": "Retrieve features for tenant, optionally filtered by category.",
        "operationId": "features-read_features",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Category Id"
            }
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "include_system",
            "in": "query",
            "required": false,
            "schema": {
              "type": "boolean",
              "default": true,
              "title": "Include System"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FeatureResponse"
                  },
                  "title": "Response Features-Read Features"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "features"
        ],
        "summary": "Create Feature",
        "description": "Create new feature. Owners, admins, and editors can create features.",
        "operationId": "features-create_feature",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/features/test": {
      "post": {
        "tags": [
          "features"
        ],
        "summary": "Create Feature Test",
        "description": "Test endpoint for creating features without auth checks",
        "operationId": "features-create_feature_test",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureCreate"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/features/{feature_id}": {
      "get": {
        "tags": [
          "features"
        ],
        "summary": "Read Feature",
        "description": "Get feature by ID.",
        "operationId": "features-read_feature",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "feature_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Feature Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "features"
        ],
        "summary": "Update Feature",
        "description": "Update feature. Owners, admins, and editors can update features.",
        "operationId": "features-update_feature",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "feature_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Feature Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "features"
        ],
        "summary": "Delete Feature",
        "description": "Delete feature. Owners, admins, and editors can delete features.",
        "operationId": "features-delete_feature",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "feature_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Feature Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Features-Delete Feature"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/features-test/": {
      "get": {
        "tags": [
          "features-test"
        ],
        "summary": "Get Features Test",
        "description": "Get all features without authentication",
        "operationId": "features-test-get_features_test",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "items": {
                    "$ref": "#/components/schemas/FeatureResponse"
                  },
                  "type": "array",
                  "title": "Response Features-Test-Get Features Test"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "features-test"
        ],
        "summary": "Create Feature Test",
        "description": "Create feature without authentication",
        "operationId": "features-test-create_feature_test",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureCreate"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/features-test/{feature_id}": {
      "delete": {
        "tags": [
          "features-test"
        ],
        "summary": "Delete Feature Test",
        "description": "Delete feature without authentication",
        "operationId": "features-test-delete_feature_test",
        "parameters": [
          {
            "name": "feature_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Feature Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Features-Test-Delete Feature Test"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "features-test"
        ],
        "summary": "Update Feature Test",
        "description": "Update feature without authentication",
        "operationId": "features-test-update_feature_test",
        "parameters": [
          {
            "name": "feature_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Feature Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/posts/test": {
      "post": {
        "tags": [
          "posts"
        ],
        "summary": "Create Post Test",
        "description": "Create test post - no auth required",
        "operationId": "posts-create_post_test",
        "parameters": [
          {
            "name": "title",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Title"
            }
          },
          {
            "name": "content",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Content"
            }
          },
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 1,
              "title": "Property Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "additionalProperties": true,
                  "title": "Response Posts-Create Post Test"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/posts/": {
      "get": {
        "tags": [
          "posts"
        ],
        "summary": "Read Posts",
        "description": "Retrieve posts for tenant, optionally filtered by property, feature, or status.",
        "operationId": "posts-read_posts",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Property Id"
            }
          },
          {
            "name": "feature_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Feature Id"
            }
          },
          {
            "name": "status",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/PostStatus"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Status"
            }
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "include_translations",
            "in": "query",
            "required": false,
            "schema": {
              "type": "boolean",
              "default": false,
              "title": "Include Translations"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PostWithTranslationResponse"
                  },
                  "title": "Response Posts-Read Posts"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "posts"
        ],
        "summary": "Create Post",
        "description": "Create new post. Editors and above can create posts.",
        "operationId": "posts-create_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PostCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostWithTranslationResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/posts": {
      "post": {
        "tags": [
          "posts"
        ],
        "summary": "Create Post",
        "description": "Create new post. Editors and above can create posts.",
        "operationId": "posts-create_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PostCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostWithTranslationResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/posts/{post_id}": {
      "get": {
        "tags": [
          "posts"
        ],
        "summary": "Read Post",
        "description": "Get post by ID.",
        "operationId": "posts-read_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "posts"
        ],
        "summary": "Update Post",
        "description": "Update post. Editors and above can update posts.",
        "operationId": "posts-update_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PostUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostWithTranslationResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "posts"
        ],
        "summary": "Delete Post",
        "description": "Delete post. OWNER, ADMIN, and EDITOR can delete posts.",
        "operationId": "posts-delete_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Posts-Delete Post"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/posts/{post_id}/publish": {
      "post": {
        "tags": [
          "posts"
        ],
        "summary": "Publish Post",
        "description": "Publish a post. Editors and above can publish posts.",
        "operationId": "posts-publish_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/posts/{post_id}/archive": {
      "post": {
        "tags": [
          "posts"
        ],
        "summary": "Archive Post",
        "description": "Archive a post. Editors and above can archive posts.",
        "operationId": "posts-archive_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/media/upload": {
      "post": {
        "tags": [
          "media"
        ],
        "summary": "Upload Media File",
        "operationId": "media-upload_media_file",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "kind",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Kind"
            }
          },
          {
            "name": "alt_text",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Alt Text"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/Body_media-upload_media_file"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Media-Upload Media File"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/media/": {
      "get": {
        "tags": [
          "media"
        ],
        "summary": "Read Media Files",
        "description": "Get media files for current tenant",
        "operationId": "media-read_media_files",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/MediaFileResponse"
                  },
                  "title": "Response Media-Read Media Files"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/media/{file_key}": {
      "get": {
        "tags": [
          "media"
        ],
        "summary": "Serve Media File",
        "description": "Serve uploaded media files with CORS headers",
        "operationId": "media-serve_media_file",
        "parameters": [
          {
            "name": "file_key",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "File Key"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/media/{media_id}/view": {
      "get": {
        "tags": [
          "media"
        ],
        "summary": "View Media File",
        "description": "View/display media file by ID - Public endpoint for image display",
        "operationId": "media-view_media_file",
        "parameters": [
          {
            "name": "media_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Media Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/media/{media_id}/download": {
      "get": {
        "tags": [
          "media"
        ],
        "summary": "Download Media File",
        "description": "Download media file by ID with proper headers",
        "operationId": "media-download_media_file",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "media_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Media Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/media/{media_id}": {
      "put": {
        "tags": [
          "media"
        ],
        "summary": "Update Media File",
        "description": "Update media file information",
        "operationId": "media-update_media_file",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "media_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Media Id"
            }
          },
          {
            "name": "original_filename",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Original Filename"
            }
          },
          {
            "name": "alt_text",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Alt Text"
            }
          },
          {
            "name": "kind",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Kind"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "media"
        ],
        "summary": "Delete Media File",
        "description": "Delete media file",
        "operationId": "media-delete_media_file",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "media_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Media Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/events/": {
      "post": {
        "tags": [
          "events"
        ],
        "summary": "Log Event",
        "description": "Log an analytics event",
        "operationId": "events-log_event",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/EventCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EventResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "get": {
        "tags": [
          "events"
        ],
        "summary": "List Events",
        "description": "List analytics events for a tenant",
        "operationId": "events-list_events",
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          },
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Property Id"
            }
          },
          {
            "name": "event_type",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "$ref": "#/components/schemas/EventType"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Event Type"
            }
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/EventResponse"
                  },
                  "title": "Response Events-List Events"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/events/stats/summary": {
      "get": {
        "tags": [
          "events"
        ],
        "summary": "Get Event Stats",
        "description": "Get event statistics summary",
        "operationId": "events-get_event_stats",
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          },
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Property Id"
            }
          },
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 7,
              "title": "Days"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/events/stats/popular-content": {
      "get": {
        "tags": [
          "events"
        ],
        "summary": "Get Popular Content",
        "description": "Get most popular content by views",
        "operationId": "events-get_popular_content",
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          },
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Property Id"
            }
          },
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 7,
              "title": "Days"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 10,
              "title": "Limit"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/settings/": {
      "get": {
        "tags": [
          "settings"
        ],
        "summary": "List Settings",
        "description": "List settings for tenant/property - requires authentication",
        "operationId": "settings-list_settings",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Property Id"
            }
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SettingResponse"
                  },
                  "title": "Response Settings-List Settings"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "settings"
        ],
        "summary": "Create Setting",
        "description": "Create new setting - requires OWNER or ADMIN role",
        "operationId": "settings-create_setting",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SettingCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SettingResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/settings/tenant/{tenant_id}": {
      "get": {
        "tags": [
          "settings"
        ],
        "summary": "Get Tenant Settings",
        "description": "Get all tenant-level settings - requires authentication",
        "operationId": "settings-get_tenant_settings",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SettingResponse"
                  },
                  "title": "Response Settings-Get Tenant Settings"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/settings/property/{tenant_id}/{property_id}": {
      "get": {
        "tags": [
          "settings"
        ],
        "summary": "Get Property Settings",
        "description": "Get all property-level settings - requires authentication",
        "operationId": "settings-get_property_settings",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          },
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/SettingResponse"
                  },
                  "title": "Response Settings-Get Property Settings"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/settings/key/{key_name}": {
      "get": {
        "tags": [
          "settings"
        ],
        "summary": "Get Setting By Key",
        "description": "Get specific setting by key - requires authentication",
        "operationId": "settings-get_setting_by_key",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "key_name",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Key Name"
            }
          },
          {
            "name": "tenant_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Tenant Id"
            }
          },
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Property Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "settings"
        ],
        "summary": "Update Setting By Key",
        "description": "Update setting by key (upsert) - requires OWNER or ADMIN role",
        "operationId": "settings-update_setting_by_key",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "key_name",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Key Name"
            }
          },
          {
            "name": "tenant_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Tenant Id"
            }
          },
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Property Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "additionalProperties": true,
                "title": "Value Json"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/settings/{setting_id}": {
      "put": {
        "tags": [
          "settings"
        ],
        "summary": "Update Setting",
        "description": "Update setting - requires OWNER or ADMIN role",
        "operationId": "settings-update_setting",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "setting_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Setting Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SettingUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SettingResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "settings"
        ],
        "summary": "Delete Setting",
        "description": "Delete setting - requires OWNER role only",
        "operationId": "settings-delete_setting",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "setting_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Setting Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/settings/bulk": {
      "post": {
        "tags": [
          "settings"
        ],
        "summary": "Bulk Update Settings",
        "description": "Bulk update settings for tenant/property - requires OWNER or ADMIN role",
        "operationId": "settings-bulk_update_settings",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "tenant_id",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Tenant Id"
            }
          },
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Property Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "additionalProperties": true,
                "title": "Settings"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/locales/": {
      "get": {
        "tags": [
          "locales"
        ],
        "summary": "Read Locales",
        "description": "Retrieve locales.",
        "operationId": "locales-read_locales",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/Locale"
                  },
                  "title": "Response Locales-Read Locales"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "locales"
        ],
        "summary": "Create Locale",
        "description": "Create new locale.",
        "operationId": "locales-create_locale",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LocaleCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Locale"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/locales/{code}": {
      "put": {
        "tags": [
          "locales"
        ],
        "summary": "Update Locale",
        "description": "Update a locale.",
        "operationId": "locales-update_locale",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "code",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LocaleUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Locale"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "get": {
        "tags": [
          "locales"
        ],
        "summary": "Read Locale",
        "description": "Get locale by code.",
        "operationId": "locales-read_locale",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "code",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Locale"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "locales"
        ],
        "summary": "Delete Locale",
        "description": "Delete a locale.",
        "operationId": "locales-delete_locale",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "code",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Locales-Delete Locale"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/translate": {
      "post": {
        "tags": [
          "translations"
        ],
        "summary": "Translate Batch Endpoint",
        "description": "Enhanced translation endpoint with DeepL/Google Cloud support.\n\nFeatures:\n- DeepL API for best quality (if DEEPL_API_KEY is set)\n- Google Cloud Translation (if GOOGLE_CLOUD_API_KEY is set)\n- Falls back to free Google Translate\n- Smart chunking for long texts\n- Hotel industry glossary (25+ terms)\n\nThis endpoint is public and does not require authentication.",
        "operationId": "translations-translate_batch_endpoint",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TranslateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/features": {
      "get": {
        "tags": [
          "translations"
        ],
        "summary": "Read Feature Translations",
        "description": "Retrieve feature translations for features belonging to current tenant.",
        "operationId": "translations-read_feature_translations",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FeatureTranslation"
                  },
                  "title": "Response Translations-Read Feature Translations"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "translations"
        ],
        "summary": "Create Feature Translation",
        "description": "Create new feature translation.",
        "operationId": "translations-create_feature_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureTranslationCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureTranslation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/features/{feature_id}/{locale}": {
      "get": {
        "tags": [
          "translations"
        ],
        "summary": "Get Feature Translation",
        "description": "Get a feature translation by feature ID and locale.",
        "operationId": "translations-get_feature_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "feature_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Feature Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureTranslation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "translations"
        ],
        "summary": "Update Feature Translation",
        "description": "Update a feature translation.",
        "operationId": "translations-update_feature_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "feature_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Feature Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureTranslationUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureTranslation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "translations"
        ],
        "summary": "Delete Feature Translation",
        "description": "Delete a feature translation.",
        "operationId": "translations-delete_feature_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "feature_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Feature Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Translations-Delete Feature Translation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/posts": {
      "get": {
        "tags": [
          "translations"
        ],
        "summary": "Read Post Translations",
        "description": "Retrieve post translations for posts belonging to current tenant.",
        "operationId": "translations-read_post_translations",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PostTranslation"
                  },
                  "title": "Response Translations-Read Post Translations"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "translations"
        ],
        "summary": "Create Post Translation",
        "description": "Create new post translation.",
        "operationId": "translations-create_post_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PostTranslationCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostTranslation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/posts/{post_id}/{locale}": {
      "put": {
        "tags": [
          "translations"
        ],
        "summary": "Update Post Translation",
        "description": "Update a post translation.",
        "operationId": "translations-update_post_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PostTranslationUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostTranslation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "translations"
        ],
        "summary": "Delete Post Translation",
        "description": "Delete a post translation.",
        "operationId": "translations-delete_post_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Translations-Delete Post Translation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/feature-categories": {
      "get": {
        "tags": [
          "translations"
        ],
        "summary": "Read Feature Category Translations",
        "description": "Retrieve feature category translations for categories belonging to current tenant.",
        "operationId": "translations-read_feature_category_translations",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FeatureCategoryTranslation"
                  },
                  "title": "Response Translations-Read Feature Category Translations"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "translations"
        ],
        "summary": "Create Feature Category Translation",
        "description": "Create new feature category translation.",
        "operationId": "translations-create_feature_category_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureCategoryTranslationCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategoryTranslation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/feature-categories/{category_id}/{locale}": {
      "put": {
        "tags": [
          "translations"
        ],
        "summary": "Update Feature Category Translation",
        "description": "Update a feature category translation.",
        "operationId": "translations-update_feature_category_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureCategoryTranslationUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategoryTranslation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "translations"
        ],
        "summary": "Delete Feature Category Translation",
        "description": "Delete a feature category translation.",
        "operationId": "translations-delete_feature_category_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Translations-Delete Feature Category Translation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/properties": {
      "get": {
        "tags": [
          "translations"
        ],
        "summary": "Read Property Translations",
        "description": "Retrieve property translations for properties belonging to current tenant.",
        "operationId": "translations-read_property_translations",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PropertyTranslationResponse"
                  },
                  "title": "Response Translations-Read Property Translations"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "translations"
        ],
        "summary": "Create Property Translation",
        "description": "Create new property translation.",
        "operationId": "translations-create_property_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyTranslationCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyTranslationResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/translations/properties/{property_id}/{locale}": {
      "get": {
        "tags": [
          "translations"
        ],
        "summary": "Get Property Translation",
        "description": "Get a property translation by property ID and locale.",
        "operationId": "translations-get_property_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyTranslationResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "translations"
        ],
        "summary": "Update Property Translation",
        "description": "Update a property translation.",
        "operationId": "translations-update_property_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyTranslationUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyTranslationResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "translations"
        ],
        "summary": "Delete Property Translation",
        "description": "Delete a property translation.",
        "operationId": "translations-delete_property_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          },
          {
            "name": "locale",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Locale"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Translations-Delete Property Translation"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/property-categories/": {
      "get": {
        "tags": [
          "property-categories"
        ],
        "summary": "Read Property Categories",
        "description": "Retrieve property categories.",
        "operationId": "property-categories-read_property_categories",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 0,
              "title": "Skip"
            }
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 100,
              "title": "Limit"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/FeatureCategory"
                  },
                  "title": "Response Property-Categories-Read Property Categories"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "property-categories"
        ],
        "summary": "Create Property Category",
        "description": "Create new property category.",
        "operationId": "property-categories-create_property_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/app__models__FeatureCategoryCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategory"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/property-categories/{category_id}": {
      "put": {
        "tags": [
          "property-categories"
        ],
        "summary": "Update Property Category",
        "description": "Update a property category.",
        "operationId": "property-categories-update_property_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/FeatureCategoryUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategory"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "get": {
        "tags": [
          "property-categories"
        ],
        "summary": "Read Property Category",
        "description": "Get property category by ID.",
        "operationId": "property-categories-read_property_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/FeatureCategory"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "property-categories"
        ],
        "summary": "Delete Property Category",
        "description": "Delete a property category.",
        "operationId": "property-categories-delete_property_category",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "category_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Category Id"
            }
          },
          {
            "name": "x-tenant-code",
            "in": "header",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "X-Tenant-Code"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "title": "Response Property-Categories-Delete Property Category"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/property-posts/": {
      "post": {
        "tags": [
          "property-posts"
        ],
        "summary": "Create Property Post",
        "description": "Create a new property post. OWNER, ADMIN, and EDITOR can create posts.",
        "operationId": "property-posts-create_property_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyPostCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyPostRead"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "get": {
        "tags": [
          "property-posts"
        ],
        "summary": "Read Property Posts",
        "description": "Retrieve property posts with optional filters.",
        "operationId": "property-posts-read_property_posts",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "integer"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Filter by property ID",
              "title": "Property Id"
            },
            "description": "Filter by property ID"
          },
          {
            "name": "status",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "description": "Filter by status",
              "title": "Status"
            },
            "description": "Filter by status"
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "minimum": 0,
              "description": "Number of posts to skip",
              "default": 0,
              "title": "Skip"
            },
            "description": "Number of posts to skip"
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "maximum": 100,
              "minimum": 1,
              "description": "Number of posts to return",
              "default": 100,
              "title": "Limit"
            },
            "description": "Number of posts to return"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PropertyPostRead"
                  },
                  "title": "Response Property-Posts-Read Property Posts"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/property-posts/by-locale": {
      "get": {
        "tags": [
          "property-posts"
        ],
        "summary": "Read Property Posts By Locale",
        "description": "Retrieve property posts with translations for a specific locale.",
        "operationId": "property-posts-read_property_posts_by_locale",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "query",
            "required": true,
            "schema": {
              "type": "integer",
              "description": "Property ID",
              "title": "Property Id"
            },
            "description": "Property ID"
          },
          {
            "name": "locale",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "description": "Locale code",
              "default": "en",
              "title": "Locale"
            },
            "description": "Locale code"
          },
          {
            "name": "status",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "description": "Post status",
              "default": "published",
              "title": "Status"
            },
            "description": "Post status"
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "minimum": 0,
              "description": "Number of posts to skip",
              "default": 0,
              "title": "Skip"
            },
            "description": "Number of posts to skip"
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "maximum": 100,
              "minimum": 1,
              "description": "Number of posts to return",
              "default": 100,
              "title": "Limit"
            },
            "description": "Number of posts to return"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "additionalProperties": true
                  },
                  "title": "Response Property-Posts-Read Property Posts By Locale"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/property-posts/{post_id}": {
      "get": {
        "tags": [
          "property-posts"
        ],
        "summary": "Read Property Post",
        "description": "Get a specific property post by ID.",
        "operationId": "property-posts-read_property_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyPostRead"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "property-posts"
        ],
        "summary": "Update Property Post",
        "description": "Update a property post. OWNER, ADMIN, and EDITOR can update posts.",
        "operationId": "property-posts-update_property_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyPostUpdate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyPostRead"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "property-posts"
        ],
        "summary": "Delete Property Post",
        "description": "Delete a property post. OWNER, ADMIN, and EDITOR can delete posts.",
        "operationId": "property-posts-delete_property_post",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "additionalProperties": true,
                  "title": "Response Property-Posts-Delete Property Post"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/property-posts/{post_id}/translations": {
      "get": {
        "tags": [
          "property-posts"
        ],
        "summary": "Read Property Post Translations",
        "description": "Get all translations for a specific property post.",
        "operationId": "property-posts-read_property_post_translations",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/PropertyPostTranslationRead"
                  },
                  "title": "Response Property-Posts-Read Property Post Translations"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "property-posts"
        ],
        "summary": "Create Property Post Translation",
        "description": "Create a translation for an existing property post. OWNER, ADMIN, and EDITOR can create translations.",
        "operationId": "property-posts-create_property_post_translation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "post_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Post Id"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PropertyPostTranslationCreate"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PropertyPostTranslationRead"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/property-posts/property/{property_id}/published": {
      "get": {
        "tags": [
          "property-posts"
        ],
        "summary": "Read Published Posts For Property",
        "description": "Public endpoint to get published posts for a property (no authentication required).\nThis would be used by the frontend to display blog posts.",
        "operationId": "property-posts-read_published_posts_for_property",
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          },
          {
            "name": "locale",
            "in": "query",
            "required": false,
            "schema": {
              "type": "string",
              "description": "Locale code",
              "default": "en",
              "title": "Locale"
            },
            "description": "Locale code"
          },
          {
            "name": "skip",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "minimum": 0,
              "description": "Number of posts to skip",
              "default": 0,
              "title": "Skip"
            },
            "description": "Number of posts to skip"
          },
          {
            "name": "limit",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "maximum": 100,
              "minimum": 1,
              "description": "Number of posts to return",
              "default": 100,
              "title": "Limit"
            },
            "description": "Number of posts to return"
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "additionalProperties": true
                  },
                  "title": "Response Property-Posts-Read Published Posts For Property"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/test": {
      "get": {
        "tags": [
          "analytics"
        ],
        "summary": "Test Analytics Endpoint",
        "description": "Simple test endpoint to verify analytics routes are working",
        "operationId": "analytics-test_analytics_endpoint",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/public-stats": {
      "get": {
        "tags": [
          "analytics"
        ],
        "summary": "Get Public Analytics Stats",
        "description": "PUBLIC endpoint for analytics stats (NO AUTH REQUIRED)\nUsed for demo/testing purposes\nIn production, use /stats endpoint with authentication",
        "operationId": "analytics-get_public_analytics_stats",
        "parameters": [
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 30,
              "title": "Days"
            }
          },
          {
            "name": "tenant_id",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 4,
              "title": "Tenant Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/track": {
      "post": {
        "tags": [
          "analytics"
        ],
        "summary": "Track Analytics Event",
        "description": "Track analytics events from hotel websites (PUBLIC ENDPOINT - NO AUTH)",
        "operationId": "analytics-track_analytics_event",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/TrackingRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/stats": {
      "get": {
        "tags": [
          "analytics"
        ],
        "summary": "Get Analytics Stats",
        "description": "Get analytics statistics for tenant dashboard - requires authentication",
        "operationId": "analytics-get_analytics_stats",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 30,
              "title": "Days"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/realtime": {
      "get": {
        "tags": [
          "analytics"
        ],
        "summary": "Get Realtime Stats",
        "description": "Get real-time analytics statistics - requires authentication",
        "operationId": "analytics-get_realtime_stats",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        },
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ]
      }
    },
    "/api/v1/analytics/summary/{period}": {
      "get": {
        "tags": [
          "analytics"
        ],
        "summary": "Get Analytics Summary",
        "description": "Get analytics summary data (daily/monthly) - all authenticated users can access",
        "operationId": "analytics-get_analytics_summary",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "period",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string",
              "title": "Period"
            }
          },
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 30,
              "title": "Days"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/properties/{property_id}/stats": {
      "get": {
        "tags": [
          "analytics"
        ],
        "summary": "Get Property Analytics",
        "description": "Get analytics for a specific property - all authenticated users can access",
        "operationId": "analytics-get_property_analytics",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          },
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 30,
              "title": "Days"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/embed-script/{property_id}": {
      "get": {
        "tags": [
          "analytics"
        ],
        "summary": "Get Embed Script Demo",
        "description": "Generate embed script code for a property - Demo endpoint (no auth)",
        "operationId": "analytics-get_embed_script_demo",
        "parameters": [
          {
            "name": "property_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer",
              "title": "Property Id"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/track-simple": {
      "post": {
        "tags": [
          "analytics"
        ],
        "summary": "Track Simple",
        "description": "Simple tracking test without enum issues",
        "operationId": "analytics-track_simple",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/SimpleTrackingRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/dashboard-stats": {
      "get": {
        "tags": [
          "analytics"
        ],
        "summary": "Get Dashboard Stats",
        "description": "Get dashboard statistics for the current tenant - all authenticated users can access",
        "operationId": "analytics-get_dashboard_stats",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "days",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 30,
              "title": "Days"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/DashboardStatsResponse"
                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/analytics/aggregate": {
      "post": {
        "tags": [
          "analytics"
        ],
        "summary": "Trigger Aggregation",
        "description": "Manually trigger analytics aggregation (OWNER/ADMIN only)\n\nThis will:\n1. Create daily summaries for the last N days\n2. Delete events older than 90 days\n\nUse this for:\n- Initial setup\n- Manual cleanup\n- Testing aggregation logic",
        "operationId": "analytics-trigger_aggregation",
        "security": [
          {
            "OAuth2PasswordBearer": []
          }
        ],
        "parameters": [
          {
            "name": "days_back",
            "in": "query",
            "required": false,
            "schema": {
              "type": "integer",
              "default": 7,
              "title": "Days Back"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/test-upload/test": {
      "post": {
        "tags": [
          "test-upload"
        ],
        "summary": "Test Upload Endpoint",
        "description": "Test upload endpoint without any dependencies",
        "operationId": "test-upload-test_upload_endpoint",
        "parameters": [
          {
            "name": "kind",
            "in": "query",
            "required": false,
            "schema": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ],
              "title": "Kind"
            }
          }
        ],
        "requestBody": {
          "content": {
            "multipart/form-data": {
              "schema": {
                "$ref": "#/components/schemas/Body_test-upload-test_upload_endpoint"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          },
          "422": {
            "description": "Validation Error",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/HTTPValidationError"
                }
              }
            }
          }
        }
      }
    },
    "/token-helper": {
      "get": {
        "summary": "Token Helper",
        "description": "Token helper page with auto token storage",
        "operationId": "token_helper",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "text/html": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/token-storage": {
      "get": {
        "summary": "Token Storage",
        "description": "Token storage helper page for external apps",
        "operationId": "token_storage",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "text/html": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/health": {
      "get": {
        "summary": "Health Check",
        "description": "Health check endpoint",
        "operationId": "health_check",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    },
    "/": {
      "get": {
        "summary": "Root",
        "description": "Root endpoint",
        "operationId": "root",
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": {
              "application/json": {
                "schema": {

                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "ActivityLogResponse": {
        "properties": {
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "activity_type": {
            "$ref": "#/components/schemas/ActivityType"
          },
          "details": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Details"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          }
        },
        "type": "object",
        "required": [
          "tenant_id",
          "activity_type",
          "created_at",
          "id"
        ],
        "title": "ActivityLogResponse"
      },
      "ActivityType": {
        "type": "string",
        "enum": [
          "login",
          "logout",
          "create_category",
          "update_category",
          "delete_category",
          "create_feature",
          "update_feature",
          "delete_feature",
          "upload_media",
          "update_media",
          "delete_media",
          "create_user",
          "update_user",
          "delete_user",
          "create_post",
          "update_post",
          "delete_post",
          "translate_post",
          "publish_post",
          "archive_post",
          "create_property",
          "update_property",
          "delete_property",
          "user_create_settings",
          "user_update_settings",
          "user_delete_settings",
          "create_translation",
          "update_translation",
          "delete_translation",
          "analytics_event",
          "system_update"
        ],
        "title": "ActivityType"
      },
      "AdminUserCreate": {
        "properties": {
          "email": {
            "type": "string",
            "maxLength": 190,
            "format": "email",
            "title": "Email"
          },
          "full_name": {
            "type": "string",
            "maxLength": 180,
            "title": "Full Name"
          },
          "role": {
            "$ref": "#/components/schemas/UserRole",
            "default": "EDITOR"
          },
          "is_active": {
            "type": "boolean",
            "title": "Is Active",
            "default": true
          },
          "password": {
            "type": "string",
            "minLength": 8,
            "title": "Password"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          }
        },
        "type": "object",
        "required": [
          "email",
          "full_name",
          "password",
          "tenant_id"
        ],
        "title": "AdminUserCreate"
      },
      "AdminUserPasswordUpdate": {
        "properties": {
          "current_password": {
            "type": "string",
            "title": "Current Password"
          },
          "new_password": {
            "type": "string",
            "minLength": 8,
            "title": "New Password"
          }
        },
        "type": "object",
        "required": [
          "current_password",
          "new_password"
        ],
        "title": "AdminUserPasswordUpdate"
      },
      "AdminUserResponse": {
        "properties": {
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "email": {
            "type": "string",
            "maxLength": 190,
            "format": "email",
            "title": "Email"
          },
          "full_name": {
            "type": "string",
            "maxLength": 180,
            "title": "Full Name"
          },
          "role": {
            "$ref": "#/components/schemas/UserRole",
            "default": "EDITOR"
          },
          "is_active": {
            "type": "boolean",
            "title": "Is Active",
            "default": true
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          }
        },
        "type": "object",
        "required": [
          "created_at",
          "email",
          "full_name",
          "id",
          "tenant_id"
        ],
        "title": "AdminUserResponse"
      },
      "AdminUserUpdate": {
        "properties": {
          "email": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 190,
                "format": "email"
              },
              {
                "type": "null"
              }
            ],
            "title": "Email"
          },
          "full_name": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 180
              },
              {
                "type": "null"
              }
            ],
            "title": "Full Name"
          },
          "role": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/UserRole"
              },
              {
                "type": "null"
              }
            ]
          },
          "is_active": {
            "anyOf": [
              {
                "type": "boolean"
              },
              {
                "type": "null"
              }
            ],
            "title": "Is Active"
          }
        },
        "type": "object",
        "title": "AdminUserUpdate"
      },
      "Body_auth-login": {
        "properties": {
          "grant_type": {
            "anyOf": [
              {
                "type": "string",
                "pattern": "^password$"
              },
              {
                "type": "null"
              }
            ],
            "title": "Grant Type"
          },
          "username": {
            "type": "string",
            "title": "Username"
          },
          "password": {
            "type": "string",
            "format": "password",
            "title": "Password"
          },
          "scope": {
            "type": "string",
            "title": "Scope",
            "default": ""
          },
          "client_id": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Client Id"
          },
          "client_secret": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "format": "password",
            "title": "Client Secret"
          }
        },
        "type": "object",
        "required": [
          "username",
          "password"
        ],
        "title": "Body_auth-login"
      },
      "Body_media-upload_media_file": {
        "properties": {
          "file": {
            "anyOf": [
              {
                "type": "string",
                "format": "binary"
              },
              {
                "type": "null"
              }
            ],
            "title": "File"
          }
        },
        "type": "object",
        "title": "Body_media-upload_media_file"
      },
      "Body_test-upload-test_upload_endpoint": {
        "properties": {
          "file": {
            "anyOf": [
              {
                "type": "string",
                "format": "binary"
              },
              {
                "type": "null"
              }
            ],
            "title": "File"
          }
        },
        "type": "object",
        "title": "Body_test-upload-test_upload_endpoint"
      },
      "DashboardStatsResponse": {
        "properties": {
          "total_page_views": {
            "type": "integer",
            "title": "Total Page Views",
            "default": 0
          },
          "page_views_growth": {
            "type": "number",
            "title": "Page Views Growth",
            "default": 0
          },
          "unique_visitors": {
            "type": "integer",
            "title": "Unique Visitors",
            "default": 0
          },
          "categories_this_month": {
            "type": "integer",
            "title": "Categories This Month",
            "default": 0
          },
          "features_this_month": {
            "type": "integer",
            "title": "Features This Month",
            "default": 0
          },
          "period_days": {
            "type": "integer",
            "title": "Period Days",
            "default": 30
          }
        },
        "type": "object",
        "title": "DashboardStatsResponse"
      },
      "DeviceType": {
        "type": "string",
        "enum": [
          "desktop",
          "tablet",
          "mobile"
        ],
        "title": "DeviceType"
      },
      "EventCreate": {
        "properties": {
          "locale": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 10
              },
              {
                "type": "null"
              }
            ],
            "title": "Locale"
          },
          "event_type": {
            "$ref": "#/components/schemas/EventType"
          },
          "device": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/DeviceType"
              },
              {
                "type": "null"
              }
            ]
          },
          "user_agent": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "User Agent"
          },
          "ip_hash": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 64
              },
              {
                "type": "null"
              }
            ],
            "title": "Ip Hash"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          },
          "category_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Category Id"
          },
          "feature_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Feature Id"
          },
          "post_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Post Id"
          }
        },
        "type": "object",
        "required": [
          "event_type",
          "tenant_id",
          "property_id"
        ],
        "title": "EventCreate"
      },
      "EventResponse": {
        "properties": {
          "locale": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 10
              },
              {
                "type": "null"
              }
            ],
            "title": "Locale"
          },
          "event_type": {
            "$ref": "#/components/schemas/EventType"
          },
          "device": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/DeviceType"
              },
              {
                "type": "null"
              }
            ]
          },
          "user_agent": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "User Agent"
          },
          "ip_hash": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 64
              },
              {
                "type": "null"
              }
            ],
            "title": "Ip Hash"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          },
          "category_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Category Id"
          },
          "feature_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Feature Id"
          },
          "post_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Post Id"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          }
        },
        "type": "object",
        "required": [
          "event_type",
          "id",
          "tenant_id",
          "property_id",
          "created_at"
        ],
        "title": "EventResponse"
      },
      "EventType": {
        "type": "string",
        "enum": [
          "page_view",
          "click",
          "share"
        ],
        "title": "EventType"
      },
      "FeatureCategory": {
        "properties": {
          "id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id",
            "default": 0
          },
          "slug": {
            "type": "string",
            "maxLength": 100,
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "priority": {
            "type": "integer",
            "title": "Priority",
            "default": 0
          },
          "is_system": {
            "type": "boolean",
            "title": "Is System",
            "default": false
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          }
        },
        "type": "object",
        "required": [
          "slug",
          "icon_key"
        ],
        "title": "FeatureCategory"
      },
      "FeatureCategoryCreate": {
        "properties": {
          "slug": {
            "type": "string",
            "maxLength": 100,
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "priority": {
            "type": "integer",
            "title": "Priority",
            "default": 0
          },
          "is_system": {
            "type": "boolean",
            "title": "Is System",
            "default": false
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id",
            "default": 0
          }
        },
        "type": "object",
        "required": [
          "slug"
        ],
        "title": "FeatureCategoryCreate"
      },
      "FeatureCategoryResponse": {
        "properties": {
          "slug": {
            "type": "string",
            "maxLength": 100,
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "priority": {
            "type": "integer",
            "title": "Priority",
            "default": 0
          },
          "is_system": {
            "type": "boolean",
            "title": "Is System",
            "default": false
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          }
        },
        "type": "object",
        "required": [
          "slug",
          "id",
          "tenant_id",
          "created_at"
        ],
        "title": "FeatureCategoryResponse"
      },
      "FeatureCategoryTranslation": {
        "properties": {
          "category_id": {
            "type": "integer",
            "title": "Category Id"
          },
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale"
          },
          "title": {
            "type": "string",
            "maxLength": 200,
            "title": "Title"
          },
          "short_desc": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 500
              },
              {
                "type": "null"
              }
            ],
            "title": "Short Desc"
          }
        },
        "type": "object",
        "required": [
          "category_id",
          "locale",
          "title",
          "short_desc"
        ],
        "title": "FeatureCategoryTranslation"
      },
      "FeatureCategoryTranslationCreate": {
        "properties": {
          "category_id": {
            "type": "integer",
            "title": "Category Id"
          },
          "locale": {
            "type": "string",
            "title": "Locale"
          },
          "title": {
            "type": "string",
            "title": "Title"
          },
          "short_desc": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Short Desc"
          }
        },
        "type": "object",
        "required": [
          "category_id",
          "locale",
          "title"
        ],
        "title": "FeatureCategoryTranslationCreate"
      },
      "FeatureCategoryTranslationUpdate": {
        "properties": {
          "title": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Title"
          },
          "short_desc": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Short Desc"
          }
        },
        "type": "object",
        "title": "FeatureCategoryTranslationUpdate"
      },
      "FeatureCategoryUpdate": {
        "properties": {
          "slug": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "priority": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Priority"
          },
          "is_system": {
            "anyOf": [
              {
                "type": "boolean"
              },
              {
                "type": "null"
              }
            ],
            "title": "Is System"
          }
        },
        "type": "object",
        "title": "FeatureCategoryUpdate"
      },
      "FeatureCreate": {
        "properties": {
          "slug": {
            "type": "string",
            "maxLength": 120,
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "is_system": {
            "type": "boolean",
            "title": "Is System",
            "default": false
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id",
            "default": 0
          },
          "category_id": {
            "type": "integer",
            "title": "Category Id"
          }
        },
        "type": "object",
        "required": [
          "slug",
          "category_id"
        ],
        "title": "FeatureCreate"
      },
      "FeatureResponse": {
        "properties": {
          "slug": {
            "type": "string",
            "maxLength": 120,
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "is_system": {
            "type": "boolean",
            "title": "Is System",
            "default": false
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "category_id": {
            "type": "integer",
            "title": "Category Id"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "translations": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Translations"
          }
        },
        "type": "object",
        "required": [
          "slug",
          "id",
          "tenant_id",
          "category_id",
          "created_at"
        ],
        "title": "FeatureResponse"
      },
      "FeatureTranslation": {
        "properties": {
          "feature_id": {
            "type": "integer",
            "title": "Feature Id"
          },
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale"
          },
          "title": {
            "type": "string",
            "maxLength": 200,
            "title": "Title"
          },
          "short_desc": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 500
              },
              {
                "type": "null"
              }
            ],
            "title": "Short Desc"
          }
        },
        "type": "object",
        "required": [
          "feature_id",
          "locale",
          "title",
          "short_desc"
        ],
        "title": "FeatureTranslation"
      },
      "FeatureTranslationCreate": {
        "properties": {
          "feature_id": {
            "type": "integer",
            "title": "Feature Id"
          },
          "locale": {
            "type": "string",
            "title": "Locale"
          },
          "title": {
            "type": "string",
            "title": "Title"
          },
          "short_desc": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Short Desc"
          }
        },
        "type": "object",
        "required": [
          "feature_id",
          "locale",
          "title"
        ],
        "title": "FeatureTranslationCreate"
      },
      "FeatureTranslationUpdate": {
        "properties": {
          "title": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Title"
          },
          "short_desc": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Short Desc"
          }
        },
        "type": "object",
        "title": "FeatureTranslationUpdate"
      },
      "FeatureUpdate": {
        "properties": {
          "slug": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "category_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Category Id"
          },
          "is_system": {
            "anyOf": [
              {
                "type": "boolean"
              },
              {
                "type": "null"
              }
            ],
            "title": "Is System"
          }
        },
        "type": "object",
        "title": "FeatureUpdate"
      },
      "HTTPValidationError": {
        "properties": {
          "detail": {
            "items": {
              "$ref": "#/components/schemas/ValidationError"
            },
            "type": "array",
            "title": "Detail"
          }
        },
        "type": "object",
        "title": "HTTPValidationError"
      },
      "Locale": {
        "properties": {
          "code": {
            "type": "string",
            "maxLength": 10,
            "title": "Code"
          },
          "name": {
            "type": "string",
            "maxLength": 100,
            "title": "Name"
          },
          "native_name": {
            "type": "string",
            "maxLength": 100,
            "title": "Native Name"
          }
        },
        "type": "object",
        "required": [
          "code",
          "name",
          "native_name"
        ],
        "title": "Locale"
      },
      "LocaleCreate": {
        "properties": {
          "code": {
            "type": "string",
            "title": "Code"
          },
          "name": {
            "type": "string",
            "title": "Name"
          },
          "native_name": {
            "type": "string",
            "title": "Native Name"
          }
        },
        "type": "object",
        "required": [
          "code",
          "name",
          "native_name"
        ],
        "title": "LocaleCreate"
      },
      "LocaleUpdate": {
        "properties": {
          "name": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Name"
          },
          "native_name": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Native Name"
          }
        },
        "type": "object",
        "title": "LocaleUpdate"
      },
      "MediaFileResponse": {
        "properties": {
          "kind": {
            "type": "string",
            "title": "Kind"
          },
          "mime_type": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Mime Type"
          },
          "file_key": {
            "type": "string",
            "maxLength": 255,
            "title": "File Key"
          },
          "original_filename": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Original Filename"
          },
          "width": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Width"
          },
          "height": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Height"
          },
          "size_bytes": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Size Bytes"
          },
          "alt_text": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 300
              },
              {
                "type": "null"
              }
            ],
            "title": "Alt Text"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "uploader_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Uploader Id"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          }
        },
        "type": "object",
        "required": [
          "kind",
          "file_key",
          "id",
          "tenant_id",
          "created_at"
        ],
        "title": "MediaFileResponse",
        "example": {
          "created_at": "2024-01-01T00:00:00",
          "file_key": "abc123.png",
          "id": 1,
          "kind": "image",
          "mime_type": "image/png",
          "original_filename": "my-photo.png",
          "size_bytes": 102400,
          "tenant_id": 1
        }
      },
      "PlanCreate": {
        "properties": {
          "code": {
            "type": "string",
            "maxLength": 50,
            "title": "Code"
          },
          "name": {
            "type": "string",
            "maxLength": 120,
            "title": "Name"
          },
          "features_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Features Json"
          }
        },
        "type": "object",
        "required": [
          "code",
          "name"
        ],
        "title": "PlanCreate"
      },
      "PlanResponse": {
        "properties": {
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "code": {
            "type": "string",
            "maxLength": 50,
            "title": "Code"
          },
          "name": {
            "type": "string",
            "maxLength": 120,
            "title": "Name"
          },
          "features_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Features Json"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          }
        },
        "type": "object",
        "required": [
          "created_at",
          "code",
          "name",
          "id"
        ],
        "title": "PlanResponse"
      },
      "PlanUpdate": {
        "properties": {
          "name": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Name"
          },
          "features_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Features Json"
          }
        },
        "type": "object",
        "title": "PlanUpdate"
      },
      "PostCreate": {
        "properties": {
          "slug": {
            "type": "string",
            "maxLength": 160,
            "title": "Slug"
          },
          "vr360_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Vr360 Url"
          },
          "status": {
            "$ref": "#/components/schemas/PostStatus",
            "default": "DRAFT"
          },
          "pinned": {
            "type": "boolean",
            "title": "Pinned",
            "default": true
          },
          "cover_media_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Cover Media Id"
          },
          "published_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Published At"
          },
          "tenant_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Tenant Id"
          },
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          },
          "feature_id": {
            "type": "integer",
            "title": "Feature Id"
          },
          "created_by": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Created By"
          },
          "title": {
            "type": "string",
            "maxLength": 250,
            "title": "Title"
          },
          "content_html": {
            "type": "string",
            "title": "Content Html"
          },
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale",
            "default": "en"
          }
        },
        "type": "object",
        "required": [
          "slug",
          "property_id",
          "feature_id",
          "title",
          "content_html"
        ],
        "title": "PostCreate"
      },
      "PostResponse": {
        "properties": {
          "slug": {
            "type": "string",
            "maxLength": 160,
            "title": "Slug"
          },
          "vr360_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Vr360 Url"
          },
          "status": {
            "$ref": "#/components/schemas/PostStatus",
            "default": "DRAFT"
          },
          "pinned": {
            "type": "boolean",
            "title": "Pinned",
            "default": true
          },
          "cover_media_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Cover Media Id"
          },
          "published_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Published At"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          },
          "feature_id": {
            "type": "integer",
            "title": "Feature Id"
          },
          "created_by": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Created By"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          }
        },
        "type": "object",
        "required": [
          "slug",
          "id",
          "tenant_id",
          "property_id",
          "feature_id",
          "created_at"
        ],
        "title": "PostResponse"
      },
      "PostStatus": {
        "type": "string",
        "enum": [
          "DRAFT",
          "PUBLISHED",
          "ARCHIVED"
        ],
        "title": "PostStatus"
      },
      "PostTranslation": {
        "properties": {
          "post_id": {
            "type": "integer",
            "title": "Post Id"
          },
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale"
          },
          "title": {
            "type": "string",
            "maxLength": 250,
            "title": "Title"
          },
          "subtitle": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 300
              },
              {
                "type": "null"
              }
            ],
            "title": "Subtitle"
          },
          "content_html": {
            "type": "string",
            "title": "Content Html"
          },
          "seo_title": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 250
              },
              {
                "type": "null"
              }
            ],
            "title": "Seo Title"
          },
          "seo_desc": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 300
              },
              {
                "type": "null"
              }
            ],
            "title": "Seo Desc"
          },
          "og_image_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Og Image Id"
          }
        },
        "type": "object",
        "required": [
          "post_id",
          "locale",
          "title",
          "subtitle",
          "content_html",
          "seo_title",
          "seo_desc",
          "og_image_id"
        ],
        "title": "PostTranslation"
      },
      "PostTranslationCreate": {
        "properties": {
          "post_id": {
            "type": "integer",
            "title": "Post Id"
          },
          "locale": {
            "type": "string",
            "title": "Locale"
          },
          "title": {
            "type": "string",
            "title": "Title"
          },
          "subtitle": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Subtitle"
          },
          "content_html": {
            "type": "string",
            "title": "Content Html"
          },
          "seo_title": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Seo Title"
          },
          "seo_desc": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Seo Desc"
          },
          "og_image_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Og Image Id"
          }
        },
        "type": "object",
        "required": [
          "post_id",
          "locale",
          "title",
          "content_html"
        ],
        "title": "PostTranslationCreate"
      },
      "PostTranslationUpdate": {
        "properties": {
          "title": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Title"
          },
          "subtitle": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Subtitle"
          },
          "content_html": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Content Html"
          },
          "seo_title": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Seo Title"
          },
          "seo_desc": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Seo Desc"
          },
          "og_image_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Og Image Id"
          }
        },
        "type": "object",
        "title": "PostTranslationUpdate"
      },
      "PostUpdate": {
        "properties": {
          "slug": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 160
              },
              {
                "type": "null"
              }
            ],
            "title": "Slug"
          },
          "vr360_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Vr360 Url"
          },
          "status": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/PostStatus"
              },
              {
                "type": "null"
              }
            ]
          },
          "pinned": {
            "anyOf": [
              {
                "type": "boolean"
              },
              {
                "type": "null"
              }
            ],
            "title": "Pinned"
          },
          "cover_media_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Cover Media Id"
          },
          "published_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Published At"
          },
          "title": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 250
              },
              {
                "type": "null"
              }
            ],
            "title": "Title"
          },
          "content_html": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Content Html"
          },
          "locale": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 10
              },
              {
                "type": "null"
              }
            ],
            "title": "Locale"
          }
        },
        "type": "object",
        "title": "PostUpdate"
      },
      "PostWithTranslationResponse": {
        "properties": {
          "slug": {
            "type": "string",
            "maxLength": 160,
            "title": "Slug"
          },
          "vr360_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Vr360 Url"
          },
          "status": {
            "$ref": "#/components/schemas/PostStatus",
            "default": "DRAFT"
          },
          "pinned": {
            "type": "boolean",
            "title": "Pinned",
            "default": true
          },
          "cover_media_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Cover Media Id"
          },
          "published_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Published At"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          },
          "feature_id": {
            "type": "integer",
            "title": "Feature Id"
          },
          "created_by": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Created By"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "title": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Title"
          },
          "content_html": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Content Html"
          },
          "locale": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Locale"
          },
          "translations": {
            "anyOf": [
              {
                "items": {

                },
                "type": "array"
              },
              {
                "type": "null"
              }
            ],
            "title": "Translations"
          }
        },
        "type": "object",
        "required": [
          "slug",
          "id",
          "tenant_id",
          "property_id",
          "feature_id",
          "created_at"
        ],
        "title": "PostWithTranslationResponse"
      },
      "PropertyCreate": {
        "properties": {
          "property_name": {
            "type": "string",
            "maxLength": 255,
            "title": "Property Name"
          },
          "code": {
            "type": "string",
            "maxLength": 100,
            "title": "Code"
          },
          "slogan": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Slogan"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description"
          },
          "logo_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Logo Url"
          },
          "banner_images": {
            "anyOf": [
              {
                "items": {
                  "type": "string"
                },
                "type": "array"
              },
              {
                "type": "null"
              }
            ],
            "title": "Banner Images"
          },
          "intro_video_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Intro Video Url"
          },
          "vr360_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Vr360 Url"
          },
          "address": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Address"
          },
          "district": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "District"
          },
          "city": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "City"
          },
          "country": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Country"
          },
          "postal_code": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ],
            "title": "Postal Code"
          },
          "phone_number": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 50
              },
              {
                "type": "null"
              }
            ],
            "title": "Phone Number"
          },
          "email": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100,
                "format": "email"
              },
              {
                "type": "null"
              }
            ],
            "title": "Email"
          },
          "website_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Website Url"
          },
          "zalo_oa_id": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 50
              },
              {
                "type": "null"
              }
            ],
            "title": "Zalo Oa Id"
          },
          "facebook_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Facebook Url"
          },
          "youtube_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Youtube Url"
          },
          "tiktok_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Tiktok Url"
          },
          "instagram_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Instagram Url"
          },
          "google_map_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 512
              },
              {
                "type": "null"
              }
            ],
            "title": "Google Map Url"
          },
          "latitude": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "null"
              }
            ],
            "title": "Latitude"
          },
          "longitude": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "null"
              }
            ],
            "title": "Longitude"
          },
          "primary_color": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Primary Color"
          },
          "secondary_color": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Secondary Color"
          },
          "copyright_text": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Copyright Text"
          },
          "terms_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Terms Url"
          },
          "privacy_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Privacy Url"
          },
          "timezone": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 60
              },
              {
                "type": "null"
              }
            ],
            "title": "Timezone"
          },
          "default_locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Default Locale"
          },
          "settings_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Settings Json"
          },
          "is_active": {
            "type": "boolean",
            "title": "Is Active",
            "default": true
          },
          "tenant_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Tenant Id"
          }
        },
        "type": "object",
        "required": [
          "property_name",
          "code",
          "default_locale"
        ],
        "title": "PropertyCreate"
      },
      "PropertyPostCreate": {
        "properties": {
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          },
          "status": {
            "type": "string",
            "maxLength": 50,
            "title": "Status",
            "default": "draft"
          },
          "translations": {
            "items": {
              "$ref": "#/components/schemas/PropertyPostTranslationCreate"
            },
            "type": "array",
            "title": "Translations",
            "default": []
          }
        },
        "type": "object",
        "required": [
          "property_id"
        ],
        "title": "PropertyPostCreate"
      },
      "PropertyPostRead": {
        "properties": {
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          },
          "status": {
            "type": "string",
            "maxLength": 50,
            "title": "Status",
            "default": "draft"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "translations": {
            "items": {
              "$ref": "#/components/schemas/PropertyPostTranslationRead"
            },
            "type": "array",
            "title": "Translations",
            "default": []
          }
        },
        "type": "object",
        "required": [
          "property_id",
          "id",
          "created_at",
          "updated_at"
        ],
        "title": "PropertyPostRead"
      },
      "PropertyPostTranslationCreate": {
        "properties": {
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale"
          },
          "title": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Title"
          },
          "content": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Content"
          }
        },
        "type": "object",
        "required": [
          "locale"
        ],
        "title": "PropertyPostTranslationCreate",
        "description": "Schema used when creating a translation from client input.\n\nDo NOT require `post_id` here — the server will associate the\ntranslation with the parent post. Only `locale` and `content` are\nrequired/accepted from the client."
      },
      "PropertyPostTranslationRead": {
        "properties": {
          "post_id": {
            "type": "integer",
            "title": "Post Id"
          },
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale"
          },
          "content": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Content"
          },
          "created_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "title": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Title"
          }
        },
        "type": "object",
        "required": [
          "post_id",
          "locale",
          "created_at",
          "updated_at"
        ],
        "title": "PropertyPostTranslationRead"
      },
      "PropertyPostUpdate": {
        "properties": {
          "property_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Property Id"
          },
          "status": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Status"
          },
          "translations": {
            "anyOf": [
              {
                "items": {
                  "$ref": "#/components/schemas/PropertyPostTranslationCreate"
                },
                "type": "array"
              },
              {
                "type": "null"
              }
            ],
            "title": "Translations"
          }
        },
        "type": "object",
        "title": "PropertyPostUpdate"
      },
      "PropertyResponse": {
        "properties": {
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "property_name": {
            "type": "string",
            "maxLength": 255,
            "title": "Property Name"
          },
          "code": {
            "type": "string",
            "maxLength": 100,
            "title": "Code"
          },
          "slogan": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Slogan"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description"
          },
          "logo_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Logo Url"
          },
          "banner_images": {
            "anyOf": [
              {
                "items": {
                  "type": "string"
                },
                "type": "array"
              },
              {
                "type": "null"
              }
            ],
            "title": "Banner Images"
          },
          "intro_video_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Intro Video Url"
          },
          "vr360_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Vr360 Url"
          },
          "address": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Address"
          },
          "district": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "District"
          },
          "city": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "City"
          },
          "country": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Country"
          },
          "postal_code": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ],
            "title": "Postal Code"
          },
          "phone_number": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 50
              },
              {
                "type": "null"
              }
            ],
            "title": "Phone Number"
          },
          "email": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100,
                "format": "email"
              },
              {
                "type": "null"
              }
            ],
            "title": "Email"
          },
          "website_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Website Url"
          },
          "zalo_oa_id": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 50
              },
              {
                "type": "null"
              }
            ],
            "title": "Zalo Oa Id"
          },
          "facebook_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Facebook Url"
          },
          "youtube_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Youtube Url"
          },
          "tiktok_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Tiktok Url"
          },
          "instagram_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Instagram Url"
          },
          "google_map_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 512
              },
              {
                "type": "null"
              }
            ],
            "title": "Google Map Url"
          },
          "latitude": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "null"
              }
            ],
            "title": "Latitude"
          },
          "longitude": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "null"
              }
            ],
            "title": "Longitude"
          },
          "primary_color": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Primary Color"
          },
          "secondary_color": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Secondary Color"
          },
          "copyright_text": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Copyright Text"
          },
          "terms_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Terms Url"
          },
          "privacy_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Privacy Url"
          },
          "timezone": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 60
              },
              {
                "type": "null"
              }
            ],
            "title": "Timezone"
          },
          "default_locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Default Locale"
          },
          "settings_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Settings Json"
          },
          "is_active": {
            "type": "boolean",
            "title": "Is Active",
            "default": true
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          }
        },
        "type": "object",
        "required": [
          "created_at",
          "property_name",
          "code",
          "default_locale",
          "id",
          "tenant_id"
        ],
        "title": "PropertyResponse"
      },
      "PropertyTranslationCreate": {
        "properties": {
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale"
          },
          "property_name": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Property Name"
          },
          "slogan": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Slogan"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description"
          },
          "address": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Address"
          },
          "district": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "District"
          },
          "city": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "City"
          },
          "country": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Country"
          },
          "copyright_text": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Copyright Text"
          },
          "property_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Property Id"
          }
        },
        "type": "object",
        "required": [
          "locale"
        ],
        "title": "PropertyTranslationCreate"
      },
      "PropertyTranslationResponse": {
        "properties": {
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale"
          },
          "property_name": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Property Name"
          },
          "slogan": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Slogan"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description"
          },
          "address": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Address"
          },
          "district": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "District"
          },
          "city": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "City"
          },
          "country": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Country"
          },
          "copyright_text": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Copyright Text"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          }
        },
        "type": "object",
        "required": [
          "created_at",
          "locale",
          "id",
          "property_id"
        ],
        "title": "PropertyTranslationResponse"
      },
      "PropertyTranslationUpdate": {
        "properties": {
          "property_name": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Property Name"
          },
          "slogan": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Slogan"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description"
          },
          "address": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Address"
          },
          "district": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "District"
          },
          "city": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "City"
          },
          "country": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Country"
          },
          "copyright_text": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Copyright Text"
          }
        },
        "type": "object",
        "title": "PropertyTranslationUpdate"
      },
      "PropertyUpdate": {
        "properties": {
          "property_name": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Property Name"
          },
          "code": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Code"
          },
          "slogan": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Slogan"
          },
          "description": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Description"
          },
          "logo_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Logo Url"
          },
          "banner_images": {
            "anyOf": [
              {
                "items": {
                  "type": "string"
                },
                "type": "array"
              },
              {
                "type": "null"
              }
            ],
            "title": "Banner Images"
          },
          "intro_video_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Intro Video Url"
          },
          "vr360_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Vr360 Url"
          },
          "address": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Address"
          },
          "district": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "District"
          },
          "city": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "City"
          },
          "country": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Country"
          },
          "postal_code": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 20
              },
              {
                "type": "null"
              }
            ],
            "title": "Postal Code"
          },
          "phone_number": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 50
              },
              {
                "type": "null"
              }
            ],
            "title": "Phone Number"
          },
          "email": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100,
                "format": "email"
              },
              {
                "type": "null"
              }
            ],
            "title": "Email"
          },
          "website_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Website Url"
          },
          "zalo_oa_id": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 50
              },
              {
                "type": "null"
              }
            ],
            "title": "Zalo Oa Id"
          },
          "facebook_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Facebook Url"
          },
          "youtube_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Youtube Url"
          },
          "tiktok_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Tiktok Url"
          },
          "instagram_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Instagram Url"
          },
          "google_map_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 512
              },
              {
                "type": "null"
              }
            ],
            "title": "Google Map Url"
          },
          "latitude": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "null"
              }
            ],
            "title": "Latitude"
          },
          "longitude": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "null"
              }
            ],
            "title": "Longitude"
          },
          "primary_color": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Primary Color"
          },
          "secondary_color": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Secondary Color"
          },
          "copyright_text": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Copyright Text"
          },
          "terms_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Terms Url"
          },
          "privacy_url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "Privacy Url"
          },
          "timezone": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 60
              },
              {
                "type": "null"
              }
            ],
            "title": "Timezone"
          },
          "default_locale": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 10
              },
              {
                "type": "null"
              }
            ],
            "title": "Default Locale"
          },
          "settings_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Settings Json"
          },
          "is_active": {
            "anyOf": [
              {
                "type": "boolean"
              },
              {
                "type": "null"
              }
            ],
            "title": "Is Active"
          }
        },
        "type": "object",
        "title": "PropertyUpdate"
      },
      "SettingCreate": {
        "properties": {
          "key_name": {
            "type": "string",
            "maxLength": 160,
            "title": "Key Name"
          },
          "value_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Value Json"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id",
            "default": 0
          },
          "property_id": {
            "type": "integer",
            "title": "Property Id",
            "default": 0
          }
        },
        "type": "object",
        "required": [
          "key_name"
        ],
        "title": "SettingCreate"
      },
      "SettingResponse": {
        "properties": {
          "key_name": {
            "type": "string",
            "maxLength": 160,
            "title": "Key Name"
          },
          "value_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Value Json"
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "tenant_id": {
            "type": "integer",
            "title": "Tenant Id"
          },
          "property_id": {
            "type": "integer",
            "title": "Property Id"
          }
        },
        "type": "object",
        "required": [
          "key_name",
          "id",
          "tenant_id",
          "property_id"
        ],
        "title": "SettingResponse"
      },
      "SettingUpdate": {
        "properties": {
          "value_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Value Json"
          }
        },
        "type": "object",
        "title": "SettingUpdate"
      },
      "SimpleTrackingRequest": {
        "properties": {
          "tracking_key": {
            "type": "string",
            "title": "Tracking Key"
          }
        },
        "type": "object",
        "required": [
          "tracking_key"
        ],
        "title": "SimpleTrackingRequest"
      },
      "TenantCreate": {
        "properties": {
          "name": {
            "type": "string",
            "maxLength": 200,
            "title": "Name"
          },
          "code": {
            "type": "string",
            "maxLength": 80,
            "title": "Code"
          },
          "default_locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Default Locale",
            "default": "en"
          },
          "fallback_locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Fallback Locale",
            "default": "en"
          },
          "settings_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Settings Json"
          },
          "is_active": {
            "type": "boolean",
            "title": "Is Active",
            "default": true
          },
          "plan_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Plan Id"
          }
        },
        "type": "object",
        "required": [
          "name",
          "code"
        ],
        "title": "TenantCreate"
      },
      "TenantResponse": {
        "properties": {
          "created_at": {
            "type": "string",
            "format": "date-time",
            "title": "Created At"
          },
          "updated_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Updated At"
          },
          "name": {
            "type": "string",
            "maxLength": 200,
            "title": "Name"
          },
          "code": {
            "type": "string",
            "maxLength": 80,
            "title": "Code"
          },
          "default_locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Default Locale",
            "default": "en"
          },
          "fallback_locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Fallback Locale",
            "default": "en"
          },
          "settings_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Settings Json"
          },
          "is_active": {
            "type": "boolean",
            "title": "Is Active",
            "default": true
          },
          "id": {
            "type": "integer",
            "title": "Id"
          },
          "plan_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Plan Id"
          }
        },
        "type": "object",
        "required": [
          "created_at",
          "name",
          "code",
          "id"
        ],
        "title": "TenantResponse"
      },
      "TenantUpdate": {
        "properties": {
          "name": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 200
              },
              {
                "type": "null"
              }
            ],
            "title": "Name"
          },
          "plan_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Plan Id"
          },
          "default_locale": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 10
              },
              {
                "type": "null"
              }
            ],
            "title": "Default Locale"
          },
          "fallback_locale": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 10
              },
              {
                "type": "null"
              }
            ],
            "title": "Fallback Locale"
          },
          "settings_json": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Settings Json"
          },
          "is_active": {
            "anyOf": [
              {
                "type": "boolean"
              },
              {
                "type": "null"
              }
            ],
            "title": "Is Active"
          }
        },
        "type": "object",
        "title": "TenantUpdate"
      },
      "Token": {
        "properties": {
          "access_token": {
            "type": "string",
            "title": "Access Token"
          },
          "token_type": {
            "type": "string",
            "title": "Token Type",
            "default": "bearer"
          }
        },
        "type": "object",
        "required": [
          "access_token"
        ],
        "title": "Token"
      },
      "TrackingRequest": {
        "properties": {
          "tracking_key": {
            "type": "string",
            "maxLength": 64,
            "title": "Tracking Key"
          },
          "event_type": {
            "$ref": "#/components/schemas/EventType",
            "default": "page_view"
          },
          "device": {
            "anyOf": [
              {
                "$ref": "#/components/schemas/DeviceType"
              },
              {
                "type": "null"
              }
            ],
            "default": "desktop"
          },
          "user_agent": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 255
              },
              {
                "type": "null"
              }
            ],
            "title": "User Agent"
          },
          "url": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 500
              },
              {
                "type": "null"
              }
            ],
            "title": "Url"
          },
          "referrer": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 500
              },
              {
                "type": "null"
              }
            ],
            "title": "Referrer"
          },
          "session_id": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Session Id"
          },
          "page_title": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 500
              },
              {
                "type": "null"
              }
            ],
            "title": "Page Title"
          }
        },
        "type": "object",
        "required": [
          "tracking_key"
        ],
        "title": "TrackingRequest"
      },
      "TranslateRequest": {
        "properties": {
          "texts": {
            "items": {
              "type": "string"
            },
            "type": "array",
            "title": "Texts"
          },
          "target": {
            "type": "string",
            "title": "Target",
            "default": "en"
          },
          "source": {
            "type": "string",
            "title": "Source",
            "default": "auto"
          },
          "is_html": {
            "type": "boolean",
            "title": "Is Html",
            "default": false
          },
          "concurrent": {
            "type": "integer",
            "title": "Concurrent",
            "default": 8
          },
          "prefer_deepl": {
            "type": "boolean",
            "title": "Prefer Deepl",
            "default": true
          },
          "apply_glossary": {
            "type": "boolean",
            "title": "Apply Glossary",
            "default": true
          }
        },
        "type": "object",
        "required": [
          "texts"
        ],
        "title": "TranslateRequest"
      },
      "UserRole": {
        "type": "string",
        "enum": [
          "OWNER",
          "ADMIN",
          "EDITOR",
          "VIEWER"
        ],
        "title": "UserRole"
      },
      "ValidationError": {
        "properties": {
          "loc": {
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "integer"
                }
              ]
            },
            "type": "array",
            "title": "Location"
          },
          "msg": {
            "type": "string",
            "title": "Message"
          },
          "type": {
            "type": "string",
            "title": "Error Type"
          }
        },
        "type": "object",
        "required": [
          "loc",
          "msg",
          "type"
        ],
        "title": "ValidationError"
      },
      "app__models__FeatureCategoryCreate": {
        "properties": {
          "slug": {
            "type": "string",
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "priority": {
            "type": "integer",
            "title": "Priority",
            "default": 0
          },
          "is_system": {
            "type": "boolean",
            "title": "Is System",
            "default": false
          }
        },
        "type": "object",
        "required": [
          "slug"
        ],
        "title": "FeatureCategoryCreate"
      },
      "app__schemas__content__FeatureCategoryTranslationCreate": {
        "properties": {
          "locale": {
            "type": "string",
            "maxLength": 10,
            "title": "Locale"
          },
          "title": {
            "type": "string",
            "maxLength": 200,
            "title": "Title"
          },
          "short_desc": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 500
              },
              {
                "type": "null"
              }
            ],
            "title": "Short Desc"
          },
          "category_id": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Category Id"
          }
        },
        "type": "object",
        "required": [
          "locale",
          "title"
        ],
        "title": "FeatureCategoryTranslationCreate"
      },
      "app__schemas__content__FeatureCategoryTranslationUpdate": {
        "properties": {
          "title": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 200
              },
              {
                "type": "null"
              }
            ],
            "title": "Title"
          },
          "short_desc": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 500
              },
              {
                "type": "null"
              }
            ],
            "title": "Short Desc"
          }
        },
        "type": "object",
        "title": "FeatureCategoryTranslationUpdate"
      },
      "app__schemas__content__FeatureCategoryUpdate": {
        "properties": {
          "slug": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 100
              },
              {
                "type": "null"
              }
            ],
            "title": "Slug"
          },
          "icon_key": {
            "anyOf": [
              {
                "type": "string",
                "maxLength": 120
              },
              {
                "type": "null"
              }
            ],
            "title": "Icon Key"
          },
          "priority": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Priority"
          }
        },
        "type": "object",
        "title": "FeatureCategoryUpdate"
      }
    },
    "securitySchemes": {
      "OAuth2PasswordBearer": {
        "type": "oauth2",
        "flows": {
          "password": {
            "scopes": {

            },
            "tokenUrl": "/api/v1/auth/login"
          }
        }
      }
    }
  }
}
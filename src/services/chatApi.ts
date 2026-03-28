// src/services/chatApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
// import apiClient from "./authClientService";
import axios, { AxiosError } from "axios";

// Обёртка, превращающая axios в базовый запрос для RTK Query/новая с params для мермейд
const axiosBaseQuery =
  (): import("@reduxjs/toolkit/query").BaseQueryFn<
    { url: string; method: string; data?: unknown; params?: Record<string, unknown> },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params }) => {
    try {
      const { default: apiClient } = await import("@/services/authClientService");
      const result = await apiClient({ url, method, data, params }); // ← пробросили params
      return { data: result.data };
    } catch (error) {
      let axiosError: AxiosError | null = null;
      if (axios.isAxiosError(error)) {
        axiosError = error;
      }

      return {
        error: {
          status: axiosError?.response?.status,
          data: axiosError?.response?.data ?? String(error),
        },
      };
    }
  };

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Categories", "Questions", "Models", "Diagrams"],
  // tagTypes: ["Categories", "Questions", "Models"],
  endpoints: build => ({
    // Получить список категорий
    getCategories: build.query<Category[], void>({
      query: () => ({ url: "api/chat/categories/", method: "GET" }),
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Categories" as const, id })),
              { type: "Categories", id: "LIST" },
            ]
          : [{ type: "Categories", id: "LIST" }],
    }),

    // Создать новую категорию
    createCategory: build.mutation<Category, Partial<Category>>({
      query: body => ({ url: "api/chat/categories/", method: "POST", data: body }),
      invalidatesTags: [{ type: "Categories", id: "LIST" }],
    }),

    // Получить вопросы по категории
    getQuestions: build.query<Question[], string>({
      query: categoryId => ({
        url: `api/chat/categories/${categoryId}/questions/`,
        method: "GET",
      }),
      providesTags: (result, error, categoryId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Questions" as const, id })),
              { type: "Questions", id: `CATEGORY_${categoryId}` },
            ]
          : [{ type: "Questions", id: `CATEGORY_${categoryId}` }],
    }),

    // Получить список моделей с бэкенда
    getModels: build.query<
      {
        text_models: Array<{ brand: string; model_id: string }>;
        code_models: Array<{ brand: string; model_id: string }>;
      },
      void
    >({
      query: () => ({ url: "api/chat/models/", method: "GET" }),
      providesTags: [{ type: "Models", id: "LIST" }],
    }),

    // Отправить вопрос (промпт)
    createQuestion: build.mutation<
      Question,
      {
        categoryId: string;
        prompt: string;
        model: string;
        model_type: string;
        category_id: string;
        language: string;
      }
    >({
      query: ({ categoryId, prompt, model, model_type, category_id, language }) => ({
        url: `api/chat/categories/${categoryId}/questions/`,
        method: "POST",
        data: { prompt, model, model_type, category_id, language },
      }),
      invalidatesTags: (result, error, { categoryId }) => [
        { type: "Questions", id: `CATEGORY_${categoryId}` },
      ],
    }),

    // Получить ответы по question_id
    getAnswers: build.query<Answer[], string>({
      query: questionId => ({ url: `api/chat/questions/${questionId}/answers/`, method: "GET" }),
    }),
  }),
});

// Хуки для использования в компонентах
export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useGetAnswersQuery,
  useGetModelsQuery,
} = chatApi;

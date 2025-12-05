import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    // All requests now go through Next.js API routes, same origin
    baseUrl: "/api",
    credentials: "include"
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ email: string }, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body
      })
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      })
    }),
    me: builder.query<{ email: string }, void>({
      query: () => ({
        url: "/auth/me"
      })
    }),

    getProducts: builder.query<any[], void>({
      query: () => ({
        url: "/products"
      })
    }),

    createProduct: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/products",
        method: "POST",
        body
      })
    }),

    updateProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data
      })
    }),

    updateProductStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/products/${id}/status`,
        method: "PATCH",
        body: { status }
      })
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE"
      })
    })
  })
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductMutation
} = apiSlice;

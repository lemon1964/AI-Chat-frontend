// // src/services/mermindApi.ts
// import { chatApi } from "@/services/chatApi";

// export type Diagram = {
//   id: number;
//   title: string;
//   source_text: string;
//   type: string;
//   code: string;
//   model_used?: string;
//   language?: string;
//   tags?: string;
//   created_at: string;
//   updated_at: string;
// };

// export type DiagramListItem = Pick<
//   Diagram,
//   "id" | "title" | "source_text" | "type" | "updated_at" | "tags"
// >;

// export const mermindApi = chatApi.injectEndpoints({
//   endpoints: build => ({
//     listDiagrams: build.query<
//       DiagramListItem[],
//       { q?: string; type?: string; limit?: number } | void
//     >({
//       query: (args) => ({
//         url: "api/mermaid/list/",
//         method: "GET",
//         // прокинем query-параметры, если есть
//         ...(args ? { data: undefined, params: args as unknown } : {}),
//       }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(d => ({ type: "Diagrams" as const, id: d.id })),
//               { type: "Diagrams", id: "LIST" },
//             ]
//           : [{ type: "Diagrams", id: "LIST" }],
//     }),

//     getDiagram: build.query<Diagram, number>({
//       query: (id) => ({ url: `api/mermaid/${id}/`, method: "GET" }),
//       providesTags: (result, _e, id) => [{ type: "Diagrams", id }],
//     }),

//     saveDiagram: build.mutation<
//       Diagram,
//       {
//         title?: string;
//         source_text: string;
//         type: string;
//         code: string;
//         model_used?: string;
//         language?: "ru";
//         tags?: string;
//       }
//     >({
//       query: body => ({ url: "api/mermaid/save/", method: "POST", data: body }),
//       invalidatesTags: [{ type: "Diagrams", id: "LIST" }],
//     }),

//     renameDiagram: build.mutation<
//       { ok: true },
//       { id: number; title: string; tags?: string }
//     >({
//       query: ({ id, ...data }) => ({
//         url: `api/mermaid/${id}/`,
//         method: "PATCH",
//         data,
//       }),
//       invalidatesTags: (_res, _err, { id }) => [
//         { type: "Diagrams", id },
//         { type: "Diagrams", id: "LIST" },
//       ],
//     }),

//     deleteDiagram: build.mutation<{ ok: true }, number>({
//       query: (id) => ({ url: `api/mermaid/${id}/`, method: "DELETE" }),
//       invalidatesTags: (_res, _err, id) => [
//         { type: "Diagrams", id },
//         { type: "Diagrams", id: "LIST" },
//       ],
//     }),
//   }),
// });

// export const {
//   useListDiagramsQuery,
//   useLazyListDiagramsQuery,
//   useGetDiagramQuery,
//   useLazyGetDiagramQuery,
//   useSaveDiagramMutation,
//   useRenameDiagramMutation,
//   useDeleteDiagramMutation,
// } = mermindApi;

import { create } from "zustand";
import { AdminActions, AdminStates } from "./types";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";


export const useAdminStore = create<AdminStates & AdminActions>((set,get) => ({
    authAdmin: null,
    isAdminSigninIn: false,
    isAdminCheckingAuth: false,
    isLoggingOut: false,
    posts: [],
    isDeletingPost: false,
    userList: [],
    isFetchingUsers: false,
    userError: null,
    isGettingReportedPosts: false,
    reportedPosts: [],
    isDeletingReportedPost: false,
    isCreatingForum: false,


    signin: async (data) => {
        set({isAdminSigninIn: true})
        try {
            const res = await axiosInstance.post("/admin/signin", data);
            set({authAdmin: res.data})
            toast.success("Admin Signed In Successfully")
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({isAdminSigninIn: false})
        }
    },

    checkAdminAuth: async () => {
        set({isAdminCheckingAuth: true})
        try {
            const res = await axiosInstance.get("/admin/check");
            set({authAdmin: res.data})
        } catch (error) {
            console.error("Not logged in", error)
            set({authAdmin: null})
        } finally {
            set({isAdminCheckingAuth: false})
        }
    },

    logout: async () => {
        set({isLoggingOut: true})
        try {
            await axiosInstance.post("/admin/logout")
            set({authAdmin: null})

            toast.success("Logged out successfully")
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({isLoggingOut: false})
        }
    },

    getPosts: async () => {
        try {
            const res = await axiosInstance.get("/admin/view-posts")
            set({posts: res.data})
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } 
    },

    deletePost: async ({ postId }: { postId: string }) => {
        const { posts } = get();
        try {
          set({ isDeletingPost: true });
          await axiosInstance.delete(`/admin/delete-post/${postId}`);
          set({
            posts: posts.filter((post) => post._id !== postId)
          });
          
          toast.success("Post deleted successfully");
        } catch (error) {
          if (error instanceof AxiosError && error.response?.data?.msg) {
            toast.error(error.response.data.msg as string);
          } else {
            toast.error("An unexpected error occurred.");
          }
        } finally {
          set({ isDeletingPost: false });
        }
      },

    fetchUsers: async () => {
        set({ isFetchingUsers: true, userError: null });
        try {
          const res = await axiosInstance.get("/admin/view-users");
          set({ userList: res.data });
        } catch (error) {
          const errorMessage = error instanceof AxiosError 
            ? error.response?.data?.msg 
            : "Failed to fetch users";
          set({ userError: errorMessage || "Failed to fetch users" });
        } finally {
          set({ isFetchingUsers: false });
        }
      },

      adminDeleteComment: async ({ postId, commentId }: { postId: string, commentId: string }) => {
        try {
          await axiosInstance.delete(`/admin/comment/${postId}/${commentId}`);
          
          const { posts } = get();
          const updatedPosts = posts.map(post => {
            if (post._id === postId) {
              return {
                ...post,
                comments: post.comments.filter(comment => comment._id !== commentId)
              };
            }
            return post;
          });
          
          set({ posts: updatedPosts });
          toast.success("Comment deleted successfully by admin");
          
        } catch (error) {
          if (error instanceof AxiosError && error.response?.data?.msg) {
            toast.error(error.response.data.msg as string);
          } else {
            toast.error("An unexpected error occurred.");
          }
        }
      },

    getReportedPosts: async () => {
        set({isGettingReportedPosts: true})
        try {
            const res = await axiosInstance.get('/admin/report')
            set({reportedPosts: res.data})
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.msg) {
                toast.error(error.response.data.msg as string);
            } else {
                toast.error("An unexpected error occurred.");
            }
        } finally {
            set({isGettingReportedPosts: false})
        }
    },

    deleteReportedPosts: async ({ postId }: { postId: string }) => {
        const { reportedPosts } = get();
        try {
          set({ isDeletingPost: true });
          await axiosInstance.delete(`/admin/delete-post/${postId}`);
          set({
            reportedPosts: reportedPosts.filter((post) => post._id !== postId)
          });
          
          toast.success("Post deleted successfully");
        } catch (error) {
          if (error instanceof AxiosError && error.response?.data?.msg) {
            toast.error(error.response.data.msg as string);
          } else {
            toast.error("An unexpected error occurred.");
          }
        } finally {
          set({ isDeletingPost: false });
        }
    },

    createForum: async (title: string, description: string) => {
      set({ isCreatingForum: true });
      try {
        await axiosInstance.post('/admin/create-forum', { title, description });
      } catch (error) {
        const axiosError = error instanceof AxiosError && error.response?.data?.msg
        if (axiosError.response?.data) {
          const errorMessage = axiosError.response.data.msg || 'An error occurred';
          toast.error(errorMessage);
        } else {
          toast.error('❌ Failed to create forum. Please try again.');
        }
        throw error;
      } finally {
        set({ isCreatingForum: false });
      }
    },
}))
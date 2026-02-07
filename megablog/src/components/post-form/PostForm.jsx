import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } =
        useForm({
            defaultValues: {
                title: post?.title || "",
                slug: post?.slug || "",
                content: post?.content || "",
                status: post?.status || "active",
            },
        });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        const userId = userData?.userData?.$id || userData?.$id;

        if (!userId) {
            console.log("User ID missing");
            return;
        }

        // image field ko database me jaane se rokna
        const { image, ...cleanData } = data;

        if (post) {
            const file = image[0]
                ? await appwriteService.uploadFile(image[0])
                : null;

            if (file) {
                await appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...cleanData,
                featuredImage: file ? file.$id : post.featuredImage,
            });

            if (dbPost) navigate(`/post/${dbPost.$id}`);
        } else {
            const file = await appwriteService.uploadFile(image[0]);

            if (file) {
                cleanData.featuredImage = file.$id;

                const dbPost = await appwriteService.createPost({
                    ...cleanData,
                    userId,
                });

                if (dbPost) navigate(`/post/${dbPost.$id}`);
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (!value) return "";

        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title" && value.title) {
                setValue("slug", slugTransform(value.title));
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) =>
                        setValue(
                            "slug",
                            slugTransform(e.currentTarget.value),
                            { shouldValidate: true }
                        )
                    }
                />

                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />
            </div>

            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />

                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(
                                post.featuredImage
                            )}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}

                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />

                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

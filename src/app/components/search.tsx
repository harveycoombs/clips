"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import Image from "next/image";

import { searchUsers } from "@/data/users";
import { searchPosts } from "@/data/posts";

import { motion } from "framer-motion";

interface Properties {
    query: string;
}

const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Slightly slower stagger (was 0.03)
      }
    }
  };

  const itemVariants = {
    hidden: { 
      x: -100,
      opacity: 0
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,  // Reduced from 400
        damping: 10,     // Keeping the bounce
        mass: 0.5,       // Increased from 0.2 for slower movement
      }
    }
  };

export default function Search({ query }: Properties) {
    let [users, setUsers] = useState<any[]>([]);
    let [posts, setPosts] = useState<any[]>([]);

    let [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
        (async () => {
            setLoading(true);
            
            let userResults = await searchUsers(query);
            let postResults = await searchPosts(query);

            setUsers(userResults);
            setPosts(postResults);

            setLoading(false);
        })();
    }, [query]);

    if (!query.length) return null;

    return (
        <div className="fixed inset-0 w-screen h-screen z-20 bg-gray-800 bg-opacity-10 backdrop-blur pt-20">
            <div className="w-1000 bg-white p-3 rounded-lg mx-auto shadow-md">
                <strong className="block text-base font-bold select-none">
                    {loading ? "Loading..." : `Showing ${users.length} Results`}
                </strong>
                <div className="text-sm font-semibold text-gray-400/85 mt-3 mb-1">Users</div>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="overflow-hidden">{
                    users?.length 
                        ? users?.map((user: any) => <UserSearchResult user={user} />) 
                        : <div className="text-sm select-none text-slate-400/60">No users matching &quot;{query}&quot; found</div>
                }</motion.div>
                <div className="text-sm font-semibold text-gray-400/85 mt-3 mb-1">Posts</div>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="overflow-hidden">{
                    posts?.length
                        ? posts?.map((post: any) => <PostSearchResult post={post} />)
                        : <div className="text-sm select-none text-slate-400/60">No posts matching &quot;{query}&quot; found</div>
                }</motion.div>
            </div>
        </div>
    );
}

function UserSearchResult(props: any) {
    return (
        <motion.a key={props.user.userid} variants={itemVariants} href={`/users/${props.user.userid}`} target="_blank" draggable="false" className="p-2.5 rounded-md flex justify-between items-center cursor-pointer hover:bg-slate-50 active:bg-slate-100">
            <div>
                <Image src={`/uploads/avatars/${props.user.userid}`} alt="User" draggable="false" width={46} height={46} className="object-cover aspect-square rounded-md shadow-md inline-block align-middle select-none" />
                <div className="inline-block align-middle ml-3 select-none">
                    <strong className="block text-base font-bold leading-tight text-slate-600">{props.user.firstname} {props.user.lastname}</strong>
                    <div className="text-sm font-medium text-slate-400/60">{props.user.totalposts} posts &middot; {props.user.locations}</div>
                </div>
            </div>
        </motion.a>
    );
}

function PostSearchResult(props: any) {
    return (
        <motion.a key={props.post.postid} variants={itemVariants} href={`/posts/${props.post.postid}`} target="_blank" draggable="false" className="p-2.5 rounded-md flex justify-between items-center cursor-pointer hover:bg-slate-50 active:bg-slate-100">
            <div>
                <div className="inline-block align-middle">
                    <strong className="block text-base font-bold leading-tight text-slate-600">{props.post.title}</strong>
                    <div className="text-sm font-medium text-slate-400/60">{props.post.publishdate.toString()}</div>
                </div>
            </div>
        </motion.a>
    );
}
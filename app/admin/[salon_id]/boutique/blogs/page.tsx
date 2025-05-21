"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Loader2, Calendar, Edit, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import { BlogDialog } from "./blog-dialog";
// import { AlertModal } from "./alert-modal";
import Image from "next/image";

// Données temporaires pour les articles du blog et catégories
const staticBlogArticles = [
  {
    id: 1,
    title: "Nouvelle collection printemps",
    excerpt: "Découvrez nos dernières tendances pour la saison",
    date: "2023-03-15",
    readingTime: "3 min",
    image: "/salon-1.jpg",
    category: { id: "1", name: "Nouveautés" }
  },
  {
    id: 2,
    title: "Événement spécial clients fidèles",
    excerpt: "Une soirée exclusive réservée à nos meilleurs clients",
    date: "2023-04-02",
    readingTime: "4 min",
    image: "",
    category: { id: "2", name: "Événements" }
  },
  {
    id: 3,
    title: "Interview de notre styliste en chef",
    excerpt: "Rencontre avec Marie Dupont sur les inspirations de cette année",
    date: "2023-02-28",
    readingTime: "5 min",
    image: "/salon-3.jpg",
    category: { id: "3", name: "Interviews" }
  },
  {
    id: 4,
    title: "Guide des couleurs 2023",
    excerpt: "Les palettes à adopter cette année selon nos experts",
    date: "2023-01-10",
    readingTime: "7 min",
    image: "/salon-4.jpg",
    category: { id: "4", name: "Conseils" }
  },
];

const staticCategories = [
  { id: "1", name: "Nouveautés" },
  { id: "2", name: "Événements" },
  { id: "3", name: "Interviews" },
  { id: "4", name: "Conseils" },
];

interface BlogPageClientProps {
  salonId?: string;
}

export default function BlogPageClient({ salonId }: BlogPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState(staticBlogArticles);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const filteredPosts = blogPosts.filter((post: any) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? post.category.id === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  const handleAddPost = () => {
    setSelectedPost(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: any) => {
    setSelectedPost(post);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (post: any) => {
    setPostToDelete(post);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      // Simulation de suppression
      setBlogPosts(blogPosts.filter(post => post.id !== postToDelete.id));
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'article:", error);
    }
  };

  const handleDialogSuccess = (newPost: any) => {
    if (dialogMode === "create") {
      setBlogPosts([...blogPosts, { ...newPost, id: Math.max(...blogPosts.map(p => p.id)) + 1 }]);
    } else {
      setBlogPosts(blogPosts.map(post => 
        post.id === newPost.id ? newPost : post
      ));
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-full py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
          >
            <Loader2 className="h-8 w-8 text-amber-500" />
          </motion.div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Une erreur est survenue lors du chargement des articles</div>
      ) : (
        <>
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Le Blog du Salon</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Actualités, tendances et conseils de nos experts en beauté et coiffure
            </p>
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {/* Search and filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un article..."
                  className="pl-10 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Badge
                  variant="outline"
                  className={`cursor-pointer whitespace-nowrap ${
                    selectedCategory === null ? "bg-amber-100 text-amber-800" : ""
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Tous les articles
                </Badge>
                {staticCategories.map((category: any) => (
                  <Badge
                    key={category.id}
                    variant="outline"
                    className={`cursor-pointer whitespace-nowrap ${
                      selectedCategory === category.id ? "bg-amber-100 text-amber-800" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Blog posts grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredPosts.map((post: any) => (
                    <motion.div
                      key={post.id}
                      variants={itemVariants}
                      layout
                      whileHover={{ y: -5 }}
                      className="relative"
                    >
                      <Card className="overflow-hidden border shadow-sm h-full flex flex-col">
                        <div className="relative h-48 w-full bg-gray-100">
                          {post.image ? (
                            <Image
                              src={post.image || "/placeholder-blog.svg"}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-r from-pink-50 to-purple-50">
                              <Calendar className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="bg-white p-1.5 rounded-full shadow-sm"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit className="h-3.5 w-3.5 text-amber-500" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="bg-white p-1.5 rounded-full shadow-sm"
                              onClick={() => handleDeleteClick(post)}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </motion.button>
                          </div>
                        </div>
                        <div className="p-4 flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {post.category?.name || "Non catégorisé"}
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {post.readingTime || "3 min"}
                            </div>
                          </div>
                          <h3 className="font-medium text-lg mb-2 line-clamp-2">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center text-xs text-gray-500 mt-auto">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                >
                  <Calendar className="h-8 w-8 text-gray-400" />
                </motion.div>
                <p>Aucun article trouvé</p>
                {(searchTerm || selectedCategory) && (
                  <Button variant="link" className="mt-2 text-amber-500" onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory(null)
                  }}>
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Floating action button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg"
        onClick={handleAddPost}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      {/* Blog Post Dialog */}
      {/* <BlogDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        post={selectedPost}
        mode={dialogMode}
        categories={staticCategories}
        onSuccess={handleDialogSuccess}
        salonId={salonId}
      /> */}

      {/* Delete Confirmation Modal */}
      {/* <AlertModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Supprimer l'article ?"
        description="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet article ?"
      /> */}
    </div>
  );
}
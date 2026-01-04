import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="p-6 rounded-full bg-destructive/10">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-8xl font-bold text-primary mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold text-foreground mb-2"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground mb-8 max-w-md"
        >
          Oops! Halaman yang kamu cari tidak ditemukan. Mungkin halaman sudah
          dipindahkan atau URL yang kamu masukkan salah.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button asChild variant="default" size="lg">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Ke Beranda
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default NotFoundPage;

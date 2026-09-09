import { Info, Heart } from "lucide-react";
import BottomNav from "../components/shared/BottomNav";

const More = () => {
  return (
    <div className="p-4 text-white bg-[#262626] min-h-screen flex flex-col gap-6 pb-20">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-white">Lebih Banyak</h1>
        <p className="text-sm text-gray-400 mt-1">
          Informasi tentang UMKM kami
        </p>
      </div>

      {/* About UMKM */}
      <section className="bg-[#1f1f1f] rounded-xl p-5 border border-[#3a3a3a]">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#2a2a2a] p-2 rounded-lg">
            <Info className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">Tentang UMKM</h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          UMKM ini bergerak di bidang layanan dan produk lokal dengan tujuan
          memberikan kualitas terbaik kepada pelanggan. Usaha ini didirikan
          untuk mendukung perekonomian lokal serta memberikan solusi yang mudah,
          cepat, dan terpercaya bagi masyarakat.
        </p>
        <div className="mt-4 pt-4 border-t border-[#3a3a3a] flex gap-2 flex-wrap">
          <span className="bg-[#2a2a2a] text-white px-3 py-1.5 rounded-lg text-xs font-medium">
            Produk Lokal
          </span>
          <span className="bg-[#2a2a2a] text-white px-3 py-1.5 rounded-lg text-xs font-medium">
            Kualitas Terbaik
          </span>
          <span className="bg-[#2a2a2a] text-white px-3 py-1.5 rounded-lg text-xs font-medium">
            Terpercaya
          </span>
        </div>
      </section>

      {/* Wish / Harapan */}
      <section className="bg-[#1f1f1f] rounded-xl p-5 border border-[#3a3a3a]">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#2a2a2a] p-2 rounded-lg">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-white">Harapan Kami</h2>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          Harapan kami, UMKM ini dapat terus berkembang dan memberikan manfaat
          yang lebih luas bagi masyarakat, membuka lapangan pekerjaan, serta
          berkontribusi dalam kemajuan ekonomi lokal melalui pemanfaatan
          teknologi digital.
        </p>
      </section>

      <BottomNav />
    </div>
  );
};

export default More;

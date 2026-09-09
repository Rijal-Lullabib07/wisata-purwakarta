const destinasi = [
  {
    "nama": "Cileunca Waterpark",
    "deskripsi": "Waterpark di area perbukitan, sejuk",
    "gambar": "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&h=400&fit=crop",
    "kategori": "Waterpark",
    "kecamatan": "Bojong",
    "alamat": "Cileunca, Bojong",
    "rating": 4.7,
    "ulasan": 377,
    "telepon": "",
    "jam": "Setiap hari 07.30-17.30",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "kolamRenang": true
    }
  },
  {
    "nama": "Desa Wisata Kampung Tajur",
    "deskripsi": "Desa wisata sejuk, ada homestay, warga ramah",
    "gambar": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=400&fit=crop",
    "kategori": "Desa Wisata",
    "kecamatan": "Bojong",
    "alamat": "Pasanggrahan, Bojong",
    "rating": 4.9,
    "ulasan": 121,
    "telepon": "+62 877-7861-4788",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "penginapan": true
    }
  },
  {
    "nama": "Taman Batu Purwakarta",
    "deskripsi": "Air alami bebas kaporit, batu besar unik, akses jalan agak sulit",
    "gambar": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam",
    "kecamatan": "Bojong",
    "alamat": "Jl. Taman Batu, Cipeundeuy, Kec. Bojong",
    "rating": 4.3,
    "ulasan": 5118,
    "telepon": "+62 811-820-101",
    "jam": "Senin-Jumat 08.00-16.00; Sabtu-Minggu 07.00-17.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Water Boom Jaya Tirta Abadi",
    "deskripsi": "Waterpark + penginapan, kaki Gunung Burangrang, tiket 30rb",
    "gambar": "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&h=400&fit=crop",
    "kategori": "Waterpark & Hotel",
    "kecamatan": "Bojong",
    "alamat": "Sukamanah, Bojong",
    "rating": 4.6,
    "ulasan": 189,
    "telepon": "",
    "jam": "Buka 24 jam",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "kolamRenang": true,
      "penginapan": true
    }
  },
  {
    "nama": "Wisata Alam Gunung Rahayu",
    "deskripsi": "Tiket 10rb, cocok pendaki pemula, view Bongkok & Jatiluhur",
    "gambar": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam / Hiking",
    "kecamatan": "Bojong",
    "alamat": "Via Base Camp Rajawali, Bojong Tim.",
    "rating": 4.8,
    "ulasan": 75,
    "telepon": "+62 851-2944-7175",
    "jam": "Buka 24 jam",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Bungursari Lake Park",
    "deskripsi": "Taman danau di dalam kawasan perumahan, ada jogging track",
    "gambar": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    "kategori": "Taman Danau",
    "kecamatan": "Bungursari",
    "alamat": "Jl. Awi Mekar, Bungursari",
    "rating": 4.3,
    "ulasan": 363,
    "telepon": "+62 858-8937-2022",
    "jam": "Setiap hari 08.00-21.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true,
      "joggingTrack": true
    }
  },
  {
    "nama": "Kebun Pintar Aisyah",
    "deskripsi": "Kebun edukasi + perpustakaan kecil, suasana sejuk",
    "gambar": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    "kategori": "Kebun Edukasi",
    "kecamatan": "Campaka",
    "alamat": "Kp. Cisumur, Cirende, Kec. Campaka",
    "rating": 4.5,
    "ulasan": 14,
    "telepon": "+62 877-8080-0698",
    "jam": "Setiap hari 05.00-18.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Situ Cigangsa",
    "deskripsi": "Spot jogging pagi, sayangnya agak kotor sampah",
    "gambar": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    "kategori": "Danau",
    "kecamatan": "Campaka",
    "alamat": "Jl. Cigangsa No.177, Campakasari, Kec. Campaka",
    "rating": 4.3,
    "ulasan": 403,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true,
      "joggingTrack": true
    }
  },
  {
    "nama": "Wisata Situ Cikumpay",
    "deskripsi": "Danau kecil, ramai pas libur, cocok kulineran santai",
    "gambar": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    "kategori": "Danau",
    "kecamatan": "Campaka",
    "alamat": "Cikumpay, Campaka",
    "rating": 4.6,
    "ulasan": 15,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Curug Cikalapa Cibukamanah",
    "deskripsi": "Air terjun kecil, suasana sejuk, masih dikembangkan warga",
    "gambar": "https://images.unsplash.com/photo-1432405972618-c6b0c5d00b54?w=600&h=400&fit=crop",
    "kategori": "Air Terjun",
    "kecamatan": "Cibatu",
    "alamat": "Cibukamanah, Cibatu",
    "rating": 4.4,
    "ulasan": 7,
    "telepon": "",
    "jam": "Setiap hari 07.00-17.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Kampung Kahuripan Cirangkong",
    "deskripsi": "Flying fox, outbond, tanam padi, cafe instagramable",
    "gambar": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    "kategori": "Resort & Wisata Edukasi",
    "kecamatan": "Cibatu",
    "alamat": "Jl. Kebun Karet, Cirangkong, Kec. Cibatu",
    "rating": 4.5,
    "ulasan": 1148,
    "telepon": "+62 878-8394-3896",
    "jam": "Setiap hari 08.00-17.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "wifi": true,
      "penginapan": true,
      "kolamRenang": true,
      "flyingFox": true
    }
  },
  {
    "nama": "Situ Cikadu Purwakarta",
    "deskripsi": "Cocok destinasi sepeda, jalan akses perlu perbaikan",
    "gambar": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    "kategori": "Danau",
    "kecamatan": "Cibatu",
    "alamat": "Bongas Kolot, Cikadu, Kec. Cibatu",
    "rating": 3.5,
    "ulasan": 6,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Kebun Manggis Darangdan",
    "deskripsi": "Kebun manggis & salak, sebaiknya konfirmasi buka dulu",
    "gambar": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    "kategori": "Agrowisata",
    "kecamatan": "Darangdan",
    "alamat": "Linggasari, Darangdan",
    "rating": 3.5,
    "ulasan": 6,
    "telepon": "+62 812-1879-5266",
    "jam": "Senin-Kamis & Sabtu-Minggu 10.00-16.00 (Jumat tutup)",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Pasir Kolecer Linggamukti",
    "deskripsi": "View langsung ke Bukit Patenggeng & Gunung Hejo, camping",
    "gambar": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
    "kategori": "Camping & View",
    "kecamatan": "Darangdan",
    "alamat": "Linggamukti, Darangdan",
    "rating": 4.5,
    "ulasan": 8,
    "telepon": "+62 812-2434-4874",
    "jam": "Buka 24 jam",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "camping": true
    }
  },
  {
    "nama": "Sahejo eco-Creative Park",
    "deskripsi": "Camping ground luas, cocok untuk acara/gathering kantor",
    "gambar": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
    "kategori": "Camping & Event",
    "kecamatan": "Darangdan",
    "alamat": "Kp. Wangunsari, Sawit, Kec. Darangdan",
    "rating": 4.7,
    "ulasan": 42,
    "telepon": "",
    "jam": "Setiap hari 09.00-16.00 (Jumat tutup)",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "camping": true,
      "areaBBQ": true
    }
  },
  {
    "nama": "Taman Wisata Budaya & Bumi Perkemahan Cadas Gantung",
    "deskripsi": "View dari ketinggian, ada cafe, cocok nongkrong sore",
    "gambar": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
    "kategori": "Camping & Budaya",
    "kecamatan": "Darangdan",
    "alamat": "Neglasari, Darangdan",
    "rating": 4.4,
    "ulasan": 54,
    "telepon": "+62 878-8546-2792",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "camping": true,
      "warung": true
    }
  },
  {
    "nama": "Bendungan Jatiluhur",
    "deskripsi": "Disebut 'Swiss van Java', view bendungan & pegunungan",
    "gambar": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    "kategori": "Danau/Waduk",
    "kecamatan": "Jatiluhur",
    "alamat": "Jl. Raya Jatiluhur, Jatimekar, Kec. Jatiluhur",
    "rating": 4.8,
    "ulasan": 92,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Jatiluhur Water World",
    "deskripsi": "Waterpark + resort tepi waduk, bagus buat sunset, tiket agak mahal",
    "gambar": "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&h=400&fit=crop",
    "kategori": "Waterpark",
    "kecamatan": "Jatiluhur",
    "alamat": "Jl. Waduk Jatiluhur, Jatimekar, Kec. Jatiluhur",
    "rating": 4.3,
    "ulasan": 2308,
    "telepon": "+62 264 201087",
    "jam": "Senin 13.00-17.00; Selasa-Minggu 09.00-17.00",
    "maps": "https://maps.google.com/?cid=3459544038586936122",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "kolamRenang": true
    }
  },
  {
    "nama": "Rumah Ilusi Joe Sandy Cikao Park",
    "deskripsi": "Spot foto ilusi 3D, satu area dengan Cikao Park",
    "gambar": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    "kategori": "Wisata Foto",
    "kecamatan": "Jatiluhur",
    "alamat": "Parakanlima, Kec. Jatiluhur",
    "rating": 4.6,
    "ulasan": 129,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Waduk Jatiluhur",
    "deskripsi": "Bisa ke Kampung Air naik perahu, bagus untuk sunset",
    "gambar": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    "kategori": "Danau/Waduk",
    "kecamatan": "Jatiluhur",
    "alamat": "Jatimekar, Jatiluhur",
    "rating": 4.3,
    "ulasan": 545,
    "telepon": "",
    "jam": "Setiap hari 08.00-18.00",
    "maps": "https://maps.google.com/?cid=8151917288463183728",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true,
      "sewaPerahu": true
    }
  },
  {
    "nama": "Wisata Jatiluhur",
    "deskripsi": "Naik perahu keliling waduk 30 ribu/orang",
    "gambar": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    "kategori": "Danau/Waduk",
    "kecamatan": "Jatiluhur",
    "alamat": "Jatimekar, Jatiluhur",
    "rating": 3.9,
    "ulasan": 275,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true,
      "sewaPerahu": true
    }
  },
  {
    "nama": "Air Panas Ciracas",
    "deskripsi": "Sumber air panas alami",
    "gambar": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
    "kategori": "Pemandian Air Panas",
    "kecamatan": "Kiarapedes",
    "alamat": "Ciracas, Kiarapedes",
    "rating": 4.1,
    "ulasan": 390,
    "telepon": "",
    "jam": "Buka 24 jam",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "KAMPUNG PARAKANCEURI (Desa Wisata)",
    "deskripsi": "800 mdpl, homestay, edukasi pertanian & UMKM, kaki Gunung Burangrang",
    "gambar": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&h=400&fit=crop",
    "kategori": "Desa Wisata",
    "kecamatan": "Kiarapedes",
    "alamat": "Pusakamulya, Kec. Kiarapedes",
    "rating": 4.9,
    "ulasan": 89,
    "telepon": "+62 859-2621-2815",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "penginapan": true
    }
  },
  {
    "nama": "Peternakan Kiarapedes",
    "deskripsi": "Peternakan ayam closed house, udara sejuk",
    "gambar": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    "kategori": "Agrowisata",
    "kecamatan": "Kiarapedes",
    "alamat": "Ciracas, Kiarapedes",
    "rating": 4.5,
    "ulasan": 31,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Saung Siswara",
    "deskripsi": "Sungai kecil + kolam jernih, ada resto, cocok piknik keluarga",
    "gambar": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam / Kuliner",
    "kecamatan": "Kiarapedes",
    "alamat": "Ciracas, Kiarapedes",
    "rating": 4.2,
    "ulasan": 65,
    "telepon": "+62 878-9321-2233",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Wana Wisata Cidomas",
    "deskripsi": "Sungai jernih buat renang, akses agak curam",
    "gambar": "https://images.unsplash.com/photo-1432405972618-c6b0c5d00b54?w=600&h=400&fit=crop",
    "kategori": "Sungai / Alam",
    "kecamatan": "Kiarapedes",
    "alamat": "Parakan Garokgek, Kiarapedes",
    "rating": 4.3,
    "ulasan": 163,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Curug Walanda",
    "deskripsi": "Masih sangat alami, debit air kecil di musim kemarau",
    "gambar": "https://images.unsplash.com/photo-1432405972618-c6b0c5d00b54?w=600&h=400&fit=crop",
    "kategori": "Air Terjun",
    "kecamatan": "Maniis",
    "alamat": "Sukamukti, Maniis",
    "rating": 4.6,
    "ulasan": 24,
    "telepon": "+62 838-2142-9180",
    "jam": "Setiap hari 08.00-18.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Dermaga Taneuh Beureum",
    "deskripsi": "Dermaga tepi Waduk Jatiluhur sisi barat, masih sepi",
    "gambar": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    "kategori": "Danau/Waduk",
    "kecamatan": "Maniis",
    "alamat": "Kp. Taneuh Beureum, Tegaldatar, Kec. Maniis",
    "rating": 5,
    "ulasan": 2,
    "telepon": "",
    "jam": "Buka 24 jam",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Saung Liwet Cikadu Maniis",
    "deskripsi": "Nasi liwet & kopi dengan suasana alam",
    "gambar": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    "kategori": "Kuliner Alam",
    "kecamatan": "Maniis",
    "alamat": "Citamiang, Maniis",
    "rating": 5,
    "ulasan": 1,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Bumi Perkemahan Rangga Gading Pasawahan",
    "deskripsi": "Camping ground, suasana nyaman & aman",
    "gambar": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
    "kategori": "Camping Ground",
    "kecamatan": "Pasawahan",
    "alamat": "Margasari, Pasawahan",
    "rating": 5,
    "ulasan": 4,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "camping": true
    }
  },
  {
    "nama": "Curug Ki Obek",
    "deskripsi": "Hidden gem, tiket 10rb, trek agak curam",
    "gambar": "https://images.unsplash.com/photo-1432405972618-c6b0c5d00b54?w=600&h=400&fit=crop",
    "kategori": "Air Terjun",
    "kecamatan": "Plered",
    "alamat": "Gandasoli, Plered",
    "rating": 4.3,
    "ulasan": 23,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Morina Resort",
    "deskripsi": "Spot healing keluarga, view eksotis",
    "gambar": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    "kategori": "Resort",
    "kecamatan": "Plered",
    "alamat": "Cibogohilir, Plered",
    "rating": 5,
    "ulasan": 8,
    "telepon": "+62 812-9443-3175",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "wifi": true,
      "penginapan": true,
      "kolamRenang": true
    }
  },
  {
    "nama": "Terowongan Kereta Api Plered",
    "deskripsi": "Terowongan bersejarah, limit tinggi kendaraan 3,5m",
    "gambar": "https://images.unsplash.com/photo-1461360370896-922624d12a1e?w=600&h=400&fit=crop",
    "kategori": "Situs Sejarah",
    "kecamatan": "Plered",
    "alamat": "Jl. Raya Plered, Plered",
    "rating": 5,
    "ulasan": 1,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Wisata Hutan Pelangi",
    "deskripsi": "Hutan mahoni edukasi, dekat Museum Keramik Plered, parkir 5-10rb",
    "gambar": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam Edukasi",
    "kecamatan": "Plered",
    "alamat": "Anjun, Plered",
    "rating": 4.5,
    "ulasan": 39,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Alun-alun Purwakarta",
    "deskripsi": "Pusat kota, adem, dekat Masjid Agung Baing Yusuf",
    "gambar": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    "kategori": "Taman Kota",
    "kecamatan": "Purwakarta",
    "alamat": "Purwamekar, Nagri Tengah, Kec. Purwakarta",
    "rating": 4.6,
    "ulasan": 6332,
    "telepon": "",
    "jam": "",
    "maps": "https://maps.google.com/?cid=6410772230876655249",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "joggingTrack": true
    }
  },
  {
    "nama": "Anven Waterpark dan Cafe",
    "deskripsi": "Kolam renang + cafe, playground anak",
    "gambar": "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&h=400&fit=crop",
    "kategori": "Waterpark",
    "kecamatan": "Purwakarta",
    "alamat": "Jl. Jend. Ahmad Yani No.165, Cipaisan, Kec. Purwakarta",
    "rating": 4.5,
    "ulasan": 434,
    "telepon": "+62 823-1102-8031",
    "jam": "Senin-Jumat 08.00-21.00; Sabtu-Minggu 07.00-21.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "kolamRenang": true,
      "playground": true
    }
  },
  {
    "nama": "Avocado Garden Munjul Jaya Purwakarta",
    "deskripsi": "Kebun alpukat, buka akhir pekan saja",
    "gambar": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    "kategori": "Kebun/Agrowisata",
    "kecamatan": "Purwakarta",
    "alamat": "Munjuljaya, Purwakarta",
    "telepon": "+62 813-8058-8870",
    "jam": "Sabtu-Minggu 08.00-17.00 (Senin-Jumat tutup)",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Bale Panyawangan Diorama Nusantara",
    "deskripsi": "Museum diorama modern, gratis, tutup Senin & Sabtu",
    "gambar": "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=600&h=400&fit=crop",
    "kategori": "Museum",
    "kecamatan": "Purwakarta",
    "alamat": "Jl. K.K Singawinata, Nagri Tengah, Kec. Purwakarta",
    "rating": 4.5,
    "ulasan": 628,
    "telepon": "",
    "jam": "Selasa-Kamis 09.00-12.00 & 13.00-15.00/17.00; Jumat 09.00-11.30 & 13.30-15.00; Senin & Sabtu Tutup",
    "maps": "https://maps.google.com/?cid=7585121372792434155",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true
    }
  },
  {
    "nama": "Maya Datar Park",
    "deskripsi": "Air mancur malam hari, di dalam area alun-alun",
    "gambar": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    "kategori": "Taman Kota",
    "kecamatan": "Purwakarta",
    "alamat": "Nagri Tengah, Purwakarta",
    "rating": 4.5,
    "ulasan": 339,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "joggingTrack": true
    }
  },
  {
    "nama": "Niagara Waterpark (Hot Spring Water)",
    "deskripsi": "Waterpark dengan hotel, rating campuran soal kebersihan",
    "gambar": "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&h=400&fit=crop",
    "kategori": "Waterpark & Hotel",
    "kecamatan": "Purwakarta",
    "alamat": "Jl. Terusan Ibrahim Singadilaga No.35, Nagri Kaler",
    "rating": 4,
    "ulasan": 315,
    "telepon": "+62 815-6045-000",
    "jam": "Setiap hari 08.00-22.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "kolamRenang": true,
      "penginapan": true
    }
  },
  {
    "nama": "Taman Air Mancur Sri Baduga",
    "deskripsi": "Air mancur menari, ramai malam hari, dekat alun-alun",
    "gambar": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    "kategori": "Taman Kota",
    "kecamatan": "Purwakarta",
    "alamat": "Jl. Siliwangi No.73, Nagri Kidul, Kec. Purwakarta",
    "rating": 4.6,
    "ulasan": 4208,
    "telepon": "",
    "jam": "",
    "maps": "https://maps.google.com/?cid=14852612698969569422",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "joggingTrack": true
    }
  },
  {
    "nama": "Taman Pancawarna",
    "deskripsi": "Taman asri di area pemda, ada kolam ikan besar",
    "gambar": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    "kategori": "Taman Kota",
    "kecamatan": "Purwakarta",
    "alamat": "Nagri Kidul, Purwakarta",
    "rating": 4.6,
    "ulasan": 314,
    "telepon": "",
    "jam": "Setiap hari 08.00-18.00",
    "maps": "https://maps.google.com/?cid=3271900387553630961",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "joggingTrack": true
    }
  },
  {
    "nama": "Taman Pasanggrahan Pajajaran",
    "deskripsi": "Taman dekat Masjid Baing Yusuf, ada patung macan besar",
    "gambar": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    "kategori": "Taman Kota",
    "kecamatan": "Purwakarta",
    "alamat": "Nagri Tengah, Purwakarta",
    "rating": 4.6,
    "ulasan": 47,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "joggingTrack": true
    }
  },
  {
    "nama": "Curug Tilu",
    "deskripsi": "Terawat, trek hiking sedang",
    "gambar": "https://images.unsplash.com/photo-1432405972618-c6b0c5d00b54?w=600&h=400&fit=crop",
    "kategori": "Air Terjun",
    "kecamatan": "Sukasari",
    "alamat": "Ciririp, Sukasari",
    "rating": 4.3,
    "ulasan": 647,
    "telepon": "",
    "jam": "Setiap hari 07.30-17.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Kampung Madang Travel",
    "deskripsi": "Tepi Waduk Jatiluhur, kuliner ikan segar",
    "gambar": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    "kategori": "Wisata Danau/Kuliner",
    "kecamatan": "Sukasari",
    "alamat": "Jl. Raya Kertamanah, Kec. Sukasari",
    "rating": 4.3,
    "ulasan": 576,
    "telepon": "",
    "jam": "Buka 24 jam",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Wisata Alam Curug Cimata Indung",
    "deskripsi": "Sepi pengunjung, gratis masuk, akses jalan rusak",
    "gambar": "https://images.unsplash.com/photo-1432405972618-c6b0c5d00b54?w=600&h=400&fit=crop",
    "kategori": "Air Terjun",
    "kecamatan": "Sukasari",
    "alamat": "Kp. Cisaat, Sukasari",
    "rating": 4.5,
    "ulasan": 43,
    "telepon": "+62 878-7977-7542",
    "jam": "Setiap hari 07.00-17.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Wisata Tanjung Panorama Sari",
    "deskripsi": "Hidden gem, view panorama bagus tapi akses jalan rusak",
    "gambar": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam",
    "kecamatan": "Sukasari",
    "alamat": "Kutamanah, Sukasari",
    "rating": 4.3,
    "ulasan": 118,
    "telepon": "",
    "jam": "Setiap hari 06.00-18.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Wisata Waduk Parang Gombong",
    "deskripsi": "Hidden gem, hati-hati pungli, bisa camping dengan izin jelas",
    "gambar": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    "kategori": "Danau/Waduk",
    "kecamatan": "Sukasari",
    "alamat": "Kutamanah, Sukasari",
    "rating": 4.4,
    "ulasan": 577,
    "telepon": "",
    "jam": "Buka 24 jam",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true,
      "camping": true
    }
  },
  {
    "nama": "Cikao Park",
    "deskripsi": "Waterpark + mini zoo, akses gampang dari tol Cileunyi",
    "gambar": "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&h=400&fit=crop",
    "kategori": "Waterpark & Mini Zoo",
    "kecamatan": "Sukatani",
    "alamat": "Jalan Raya Sukatani, Cisalada, Kec. Sukatani",
    "rating": 4.3,
    "ulasan": 8524,
    "telepon": "+62 811-1239-933",
    "jam": "Setiap hari 08.00-17.00",
    "maps": "https://maps.google.com/?cid=15327548444760183914",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "kolamRenang": true
    }
  },
  {
    "nama": "Gunung Lembu",
    "deskripsi": "Puncak 792 mdpl, view Waduk Jatiluhur & Gunung Parang",
    "gambar": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam / Hiking",
    "kecamatan": "Sukatani",
    "alamat": "Panyindangan, Sukatani",
    "rating": 4.6,
    "ulasan": 543,
    "telepon": "+62 819-0051-2080",
    "jam": "Buka 24 jam",
    "maps": "https://maps.google.com/?cid=7641281563526411322",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Hidden Valley Hills",
    "deskripsi": "Resort hill view, kolam renang, cocok honeymoon/staycation",
    "gambar": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
    "kategori": "Resort & Hotel",
    "kecamatan": "Sukatani",
    "alamat": "Hidden Valley Drive, Cibodas, Kec. Sukatani",
    "rating": 4.4,
    "ulasan": 2287,
    "telepon": "+62 859-5967-2424",
    "jam": "Buka 24 jam",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "wifi": true,
      "penginapan": true,
      "kolamRenang": true
    }
  },
  {
    "nama": "Sasak Panyawangan",
    "deskripsi": "Jembatan bambu ikonik, view Jatiluhur, akses jalan kurang bagus",
    "gambar": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam",
    "kecamatan": "Tegalwaru",
    "alamat": "Sukamulya, Tegalwaru",
    "rating": 4.4,
    "ulasan": 1269,
    "telepon": "+62 813-8807-8484",
    "jam": "Setiap hari 08.00-17.00",
    "maps": "https://maps.google.com/?cid=15223016044067318710",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Wisata Alam Gunung Bongkok",
    "deskripsi": "975 mdpl, cocok pendaki pemula, spot sunrise favorit",
    "gambar": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam / Hiking",
    "kecamatan": "Tegalwaru",
    "alamat": "Sukamulya, Tegalwaru",
    "rating": 4.7,
    "ulasan": 632,
    "telepon": "+62 813-8807-8484",
    "jam": "Buka 24 jam",
    "maps": "https://maps.google.com/?cid=1142690035940982080",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Curug Cipurut, Gunung Burangrang",
    "deskripsi": "Trekking 700m dari parkir, tiket 15rb, air jernih & segar",
    "gambar": "https://images.unsplash.com/photo-1432405972618-c6b0c5d00b54?w=600&h=400&fit=crop",
    "kategori": "Air Terjun",
    "kecamatan": "Wanayasa",
    "alamat": "Wanayasa",
    "rating": 4.6,
    "ulasan": 267,
    "telepon": "",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Kahuripan Tirta Wanayasa",
    "deskripsi": "Kolam renang + banyak pilihan kuliner, rame weekend",
    "gambar": "https://images.unsplash.com/photo-1572331165267-854da2b021b1?w=600&h=400&fit=crop",
    "kategori": "Kolam Renang",
    "kecamatan": "Wanayasa",
    "alamat": "Babakan, Wanayasa",
    "rating": 4.4,
    "ulasan": 1586,
    "telepon": "",
    "jam": "Setiap hari 07.30-16.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "mushola": true,
      "parkir": true,
      "warung": true,
      "kolamRenang": true
    }
  },
  {
    "nama": "Saunghibar Hillside Purwakarta",
    "deskripsi": "Camping ground, kolam renang gratis, toilet bersih",
    "gambar": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop",
    "kategori": "Camping Ground",
    "kecamatan": "Wanayasa",
    "alamat": "Pasir muncang, Kec. Wanayasa",
    "rating": 4.8,
    "ulasan": 187,
    "telepon": "+62 877-4095-4371",
    "jam": "",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "camping": true
    }
  },
  {
    "nama": "Situ Wanayasa",
    "deskripsi": "Danau tenang, sewa lining Rp10rb, rame turis lokal",
    "gambar": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    "kategori": "Danau",
    "kecamatan": "Wanayasa",
    "alamat": "Wanasari, Wanayasa",
    "rating": 4.6,
    "ulasan": 958,
    "telepon": "+62 831-0209-6020",
    "jam": "Setiap hari 09.00-17.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true,
      "sewaPerahu": true
    }
  },
  {
    "nama": "Taman Wisata Batu Apung Alam Hijau",
    "deskripsi": "Spot foto sawah, kuliner ayam bekakak & sate maranggi",
    "gambar": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam / Foto",
    "kecamatan": "Wanayasa",
    "alamat": "Wanasari, Wanayasa",
    "rating": 4.1,
    "ulasan": 1116,
    "telepon": "+62 857-1125-1802",
    "jam": "Setiap hari 08.00-20.00",
    "maps": "https://maps.google.com/?cid=8676573696642523333",
    "fasilitas": {
      "toilet": true,
      "parkir": true,
      "warung": true
    }
  },
  {
    "nama": "Ujung Aspal - Pasirmuncang",
    "deskripsi": "Ada jalur downhill sepeda, udara sejuk, belum terlalu ramai",
    "gambar": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam",
    "kecamatan": "Wanayasa",
    "alamat": "Pasirmuncang, Kec. Wanayasa",
    "rating": 4.3,
    "ulasan": 1611,
    "telepon": "+62 822-6009-2381",
    "jam": "Setiap hari 08.00-16.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  },
  {
    "nama": "Ujung Aspal / Pasir Langlang Panyawangan",
    "deskripsi": "Trekking ke 2 air terjun, dikelilingi pohon pinus, HTM 7.500",
    "gambar": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    "kategori": "Wisata Alam",
    "kecamatan": "Wanayasa",
    "alamat": "Pusakamulya, Kiarapedes",
    "rating": 4.4,
    "ulasan": 224,
    "telepon": "+62 822-6009-2381",
    "jam": "Senin-Jumat 08.00-16.00; Sabtu-Minggu 07.30-17.00",
    "maps": "",
    "fasilitas": {
      "toilet": true,
      "parkir": true
    }
  }
]

// ---------------------------------------------------------------------------
// Enrichment otomatis: koordinat perkiraan per kecamatan + slug untuk route
// detail. Koordinat memakai titik tengah kecamatan (approximation) — bisa
// diperhalus manual per destinasi bila ingin pin yang presisi.
// ---------------------------------------------------------------------------
const koordinatKecamatan = {
  Bojong:      { latitude: -6.6340, longitude: 107.4970 },
  Bungursari:  { latitude: -6.5900, longitude: 107.4560 },
  Campaka:     { latitude: -6.6170, longitude: 107.4720 },
  Cibatu:      { latitude: -6.6010, longitude: 107.5150 },
  Darangdan:   { latitude: -6.6790, longitude: 107.4680 },
  Jatiluhur:   { latitude: -6.5560, longitude: 107.4090 },
  Kiarapedes:  { latitude: -6.6610, longitude: 107.5520 },
  Maniis:      { latitude: -6.7060, longitude: 107.4400 },
  Pasawahan:   { latitude: -6.6290, longitude: 107.3920 },
  Plered:      { latitude: -6.6180, longitude: 107.4310 },
  Purwakarta:  { latitude: -6.5569, longitude: 107.4430 },
  Sukasari:    { latitude: -6.6580, longitude: 107.4120 },
  Sukatani:    { latitude: -6.5990, longitude: 107.4990 },
  Tegalwaru:   { latitude: -6.6500, longitude: 107.4700 },
  Wanayasa:    { latitude: -6.6950, longitude: 107.3350 },
}

const slugify = (text = '') =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')

destinasi.forEach((d) => {
  const koord = koordinatKecamatan[d.kecamatan] || koordinatKecamatan.Purwakarta
  d.slug = slugify(d.nama)
  d.latitude = koord.latitude
  d.longitude = koord.longitude
})

export default destinasi

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import { Menu, X, BookOpen, Users, Bookmark, FileText, ChevronRight } from "lucide-react"

export default function Welcome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/placeholder.svg?height=40&width=40" alt="MyLib Logo" className="h-10 w-auto mr-2" />
            <span className="text-xl font-bold text-primary">MyLib</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors">
              Về chúng tôi
            </a>
            <a href="#services" className="text-gray-700 hover:text-primary transition-colors">
              Dịch vụ
            </a>
            <a href="#books" className="text-gray-700 hover:text-primary transition-colors">
              Danh mục sách
            </a>
            <a href="#blog" className="text-gray-700 hover:text-primary transition-colors">
              Blog
            </a>
            <Link href="/Login">
              <Button variant="default" size="sm">
                Đăng nhập
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <a
                href="#about"
                className="flex items-center text-gray-700 hover:text-primary py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Users size={18} className="mr-2" /> Về chúng tôi
              </a>
              <a
                href="#services"
                className="flex items-center text-gray-700 hover:text-primary py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <BookOpen size={18} className="mr-2" /> Dịch vụ
              </a>
              <a
                href="#books"
                className="flex items-center text-gray-700 hover:text-primary py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bookmark size={18} className="mr-2" /> Danh mục sách
              </a>
              <a
                href="#blog"
                className="flex items-center text-gray-700 hover:text-primary py-2 border-b border-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText size={18} className="mr-2" /> Blog
              </a>
              <Link href="/Login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" className="w-full">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Khám phá thế giới qua từng trang sách
              </h1>
              <div className="bg-primary/10 border-l-4 border-primary p-4 mb-8">
                <p className="text-lg md:text-xl italic text-gray-700">
                  "Một cuốn sách luôn được tạo nên từ hai người: người viết ra nó và người đọc nó."
                </p>
                <p className="text-right text-gray-600 mt-2">- Kosztolányi Dezső</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="group">
                  Mượn sách ngay
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline">
                  Khám phá thư viện
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:w-1/2"
            >
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full -z-10"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full -z-10"></div>
                <img
                  src="/placeholder.svg?height=500&width=600"
                  alt="Reading Illustration"
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Về chúng tôi</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Thư viện phong phú</h3>
                <p className="text-gray-600 text-center">
                  Với hơn 10,000 đầu sách đa dạng thể loại, chúng tôi mang đến cho bạn kho tàng tri thức vô tận.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Cộng đồng đọc sách</h3>
                <p className="text-gray-600 text-center">
                  Tham gia cộng đồng đọc sách sôi động, chia sẻ cảm nhận và kết nối với những người có cùng đam mê.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Dễ dàng mượn trả</h3>
                <p className="text-gray-600 text-center">
                  Hệ thống mượn trả hiện đại, giúp bạn dễ dàng tiếp cận sách mà không cần thủ tục phức tạp.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div whileHover={{ y: -10 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-blue-100 flex items-center justify-center">
                <img src="/placeholder.svg?height=200&width=400" alt="Online Reading" className="h-32 w-auto" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Đọc sách trực tuyến</h3>
                <p className="text-gray-600 mb-4">
                  Truy cập và đọc sách từ bất kỳ đâu với thư viện điện tử của chúng tôi. Hỗ trợ đa nền tảng và đồng bộ
                  tiến độ đọc.
                </p>
                <Button variant="outline" size="sm">
                  Tìm hiểu thêm
                </Button>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-green-100 flex items-center justify-center">
                <img src="/placeholder.svg?height=200&width=400" alt="Book Delivery" className="h-32 w-auto" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Giao sách tận nơi</h3>
                <p className="text-gray-600 mb-4">
                  Đặt sách trực tuyến và nhận sách tại nhà với dịch vụ giao hàng nhanh chóng và an toàn của chúng tôi.
                </p>
                <Button variant="outline" size="sm">
                  Tìm hiểu thêm
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section id="books" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Danh mục sách</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Khám phá bộ sưu tập sách đa dạng của chúng tôi, từ sách giáo khoa đến tiểu thuyết, từ sách thiếu nhi đến
              sách chuyên ngành.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Văn học", "Kinh tế", "Khoa học", "Lịch sử", "Thiếu nhi", "Tâm lý"].map((category, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg shadow p-4 text-center cursor-pointer"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium">{category}</h3>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button>Xem tất cả danh mục</Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Blog</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "10 cuốn sách nên đọc trong năm 2023",
                excerpt: "Khám phá những cuốn sách hay nhất mà bạn không nên bỏ lỡ trong năm nay.",
                date: "15/06/2023",
              },
              {
                title: "Cách tạo thói quen đọc sách mỗi ngày",
                excerpt: "Những bí quyết giúp bạn duy trì thói quen đọc sách đều đặn và hiệu quả.",
                date: "02/05/2023",
              },
              {
                title: "Lợi ích của việc đọc sách đối với não bộ",
                excerpt: "Nghiên cứu khoa học về tác động tích cực của việc đọc sách đối với sức khỏe tinh thần.",
                date: "18/04/2023",
              },
            ].map((post, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img
                    src={`/placeholder.svg?height=200&width=400&text=Blog+${index + 1}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <div className="text-sm text-gray-500 mb-2">{post.date}</div>
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Button variant="link" className="p-0">
                    Đọc tiếp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img src="/placeholder.svg?height=40&width=40" alt="MyLib Logo" className="h-10 w-auto mr-2" />
                <span className="text-xl font-bold">MyLib</span>
              </div>
              <p className="text-gray-400">Thư viện hiện đại, kết nối tri thức và đam mê đọc sách của mọi người.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Liên kết</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white transition-colors">
                    Dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#books" className="text-gray-400 hover:text-white transition-colors">
                    Danh mục sách
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>123 Đường Sách, Quận 1, TP.HCM</li>
                <li>info@mylib.com</li>
                <li>(+84) 123 456 789</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Đăng ký nhận tin</h4>
              <p className="text-gray-400 mb-4">Nhận thông tin về sách mới và sự kiện của chúng tôi.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-900"
                />
                <Button className="rounded-l-none">Gửi</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>© 2023 MyLib. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>

        {/* Decorative circles */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -mb-32 -ml-32"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/5 rounded-full -mt-40 -mr-40"></div>
      </footer>
    </div>
  )
}


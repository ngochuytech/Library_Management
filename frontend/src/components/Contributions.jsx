import "../styles/Contributions.css"

const Contributions = () => {
  return (
    <div className="contributions">
      <h2 className="contributions-title">Đóng góp</h2>

      <div className="contribution-options">
        <div className="contribution-card">
          <div className="contribution-icon">📚</div>
          <h3 className="contribution-card-title">Quyên góp sách</h3>
          <p className="contribution-description">
            Quyên góp sách bạn không còn đọc để chia sẻ kiến thức với cộng đồng.
          </p>
          <button className="contribution-button">Quyên góp ngay</button>
        </div>

        <div className="contribution-card">
          <div className="contribution-icon">💰</div>
          <h3 className="contribution-card-title">Ủng hộ tài chính</h3>
          <p className="contribution-description">
            Ủng hộ tài chính để giúp chúng tôi mua thêm sách mới và duy trì thư viện.
          </p>
          <button className="contribution-button">Ủng hộ ngay</button>
        </div>

        <div className="contribution-card">
          <div className="contribution-icon">✍️</div>
          <h3 className="contribution-card-title">Viết đánh giá</h3>
          <p className="contribution-description">
            Chia sẻ cảm nhận và đánh giá của bạn về sách để giúp người khác lựa chọn.
          </p>
          <button className="contribution-button">Viết đánh giá</button>
        </div>

        <div className="contribution-card">
          <div className="contribution-icon">🔍</div>
          <h3 className="contribution-card-title">Đề xuất sách mới</h3>
          <p className="contribution-description">
            Đề xuất những cuốn sách bạn muốn thấy trong thư viện của chúng tôi.
          </p>
          <button className="contribution-button">Đề xuất sách</button>
        </div>
      </div>

      <div className="contribution-stats">
        <h3 className="stats-title">Thống kê đóng góp</h3>
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">1,245</div>
            <div className="stat-text">Sách đã quyên góp</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">523</div>
            <div className="stat-text">Người đóng góp</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">3,782</div>
            <div className="stat-text">Đánh giá đã viết</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">856</div>
            <div className="stat-text">Đề xuất sách mới</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contributions


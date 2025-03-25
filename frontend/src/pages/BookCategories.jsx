import React from 'react';

const BookCategories = () => {
  // Icon SVG components
  const icons = {
    literature: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    economics: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
        <path d="M2 20h20"></path>
      </svg>
    ),
    science: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2"></path>
        <line x1="10" y1="12" x2="14" y2="12"></line>
      </svg>
    ),
    history: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <path d="M12 7v5l4 2"></path>
      </svg>
    ),
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 12h.01"></path>
        <path d="M15 12h.01"></path>
        <path d="M10 16c.5.3 1.5.5 2 .5s1.5-.2 2-.5"></path>
        <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
      </svg>
    ),
    psychology: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a7 7 0 0 0-7 7c0 4 3 6 4 8 1 2 0 3 0 3h6s-1-1 0-3c1-2 4-4 4-8a7 7 0 0 0-7-7Z"></path>
        <path d="M8 16v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3"></path>
      </svg>
    ),
  };

  // Danh mục sách
  const bookCategories = [
    { name: "Văn học", icon: icons.literature },
    { name: "Kinh tế", icon: icons.economics },
    { name: "Khoa học", icon: icons.science },
    { name: "Lịch sử", icon: icons.history },
    { name: "Thiếu nhi", icon: icons.children },
    { name: "Tâm lý", icon: icons.psychology },
  ];

  // CSS cho component
  const styles = {
    container: {
      padding: '2rem 0',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    divider: {
      width: '50px',
      height: '4px',
      backgroundColor: '#3b82f6',
      margin: '0 auto 1.5rem auto',
    },
    description: {
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto 2rem auto',
      color: '#4b5563',
    },
    grid: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '1rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    categoryItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem',
      borderRadius: '0.5rem',
      width: '170px',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#f5f5f5',
      marginBottom: '15px',
      transition: 'all 0.3s ease',
      color: '#3b82f6',
    },
    categoryName: {
      fontSize: '1.1rem',
      fontWeight: '500',
      margin: '0',
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '2rem',
      display: 'block',
      margin: '2rem auto 0 auto',
      transition: 'background-color 0.3s',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Danh mục sách</h2>
      <div style={styles.divider}></div>
      <p style={styles.description}>
        Khám phá bộ sưu tập sách đa dạng của chúng tôi, từ sách giáo khoa đến tiểu thuyết, từ sách thiếu nhi đến sách chuyên ngành.
      </p>

      <div style={styles.grid}>
        {bookCategories.map((category, index) => (
          <div 
            key={index} 
            style={styles.categoryItem}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
              e.currentTarget.querySelector('.icon-container').style.backgroundColor = '#e0f2fe';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              e.currentTarget.querySelector('.icon-container').style.backgroundColor = '#f5f5f5';
            }}
          >
            <div className="icon-container" style={styles.iconContainer}>
              {category.icon}
            </div>
            <h3 style={styles.categoryName}>{category.name}</h3>
          </div>
        ))}
      </div>

      <button style={styles.button}>
        Xem tất cả danh mục
      </button>
    </div>
  );
};

export default BookCategories;
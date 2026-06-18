import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  BarChart3,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  Menu,
  X,
  Home,
  FileText,
} from "lucide-react";

export default function SistemAbsensiApp() {
  const [authPage, setAuthPage] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    nama: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("appUsers");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        nama: "Administrator",
        username: "admin",
        password: "admin123",
        role: "admin",
      },
    ];
  });

  const [currentView, setCurrentView] = useState("dashboard");
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem("students");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, nama: "Ahmad Ridho", kelas: "X-A", nisn: "001" },
      { id: 2, nama: "Siti Nurhaliza", kelas: "X-A", nisn: "002" },
      { id: 3, nama: "Muhammad Ilham", kelas: "X-A", nisn: "003" },
      { id: 4, nama: "Dina Pratiwi", kelas: "X-A", nisn: "004" },
      { id: 5, nama: "Reza Firmansyah", kelas: "X-A", nisn: "005" },
    ];
  });
  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem("attendance");
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [newStudent, setNewStudent] = useState({
    nama: "",
    kelas: "",
    nisn: "",
  });

  useEffect(() => {
    localStorage.setItem("appUsers", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem("attendance", JSON.stringify(attendance));
  }, [attendance]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    if (!loginData.username || !loginData.password) {
      setAuthError("Username dan password harus diisi!");
      return;
    }
    const user = users.find(
      (u) =>
        u.username === loginData.username && u.password === loginData.password,
    );
    if (user) {
      setCurrentUser({
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      });
      setLoginData({ username: "", password: "" });
      setCurrentView("dashboard");
    } else {
      setAuthError("Username atau password salah!");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError("");
    if (
      !registerData.nama ||
      !registerData.username ||
      !registerData.password ||
      !registerData.confirmPassword
    ) {
      setAuthError("Semua field harus diisi!");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setAuthError("Password tidak cocok!");
      return;
    }
    if (registerData.password.length < 6) {
      setAuthError("Password minimal 6 karakter!");
      return;
    }
    if (users.find((u) => u.username === registerData.username)) {
      setAuthError("Username sudah terdaftar!");
      return;
    }
    const newId = Math.max(...users.map((u) => u.id), 0) + 1;
    setUsers([...users, { id: newId, ...registerData, role: "user" }]);
    setAuthError("");
    setRegisterData({
      nama: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setAuthPage("login");
    alert("✓ Akun berhasil dibuat! Silakan login.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthPage("login");
    setLoginData({ username: "", password: "" });
    setAuthError("");
    setMobileMenuOpen(false);
  };

  const handleAttendanceChange = (studentId, status) => {
    const key = `${studentId}-${selectedDate}`;
    setAttendance((prev) => ({ ...prev, [key]: status }));
  };

  const getAttendanceStatus = (studentId, date) => {
    return attendance[`${studentId}-${date}`] || "pending";
  };

  const calculateStats = () => {
    let hadir = 0,
      sakit = 0,
      izin = 0,
      alfa = 0;
    students.forEach((s) => {
      const status = getAttendanceStatus(s.id, selectedDate);
      if (status === "hadir") hadir++;
      else if (status === "sakit") sakit++;
      else if (status === "izin") izin++;
      else if (status === "alfa") alfa++;
    });
    return { hadir, sakit, izin, alfa };
  };

  const addStudent = () => {
    if (newStudent.nama && newStudent.kelas && newStudent.nisn) {
      const newId = Math.max(...students.map((s) => s.id), 0) + 1;
      setStudents([...students, { id: newId, ...newStudent }]);
      setNewStudent({ nama: "", kelas: "", nisn: "" });
      alert("✓ Siswa berhasil ditambahkan!");
    } else {
      alert("⚠️ Harap isi semua field!");
    }
  };

  const deleteStudent = (id) => {
    if (confirm("Yakin hapus siswa ini?")) {
      setStudents(students.filter((s) => s.id !== id));
      alert("✓ Siswa berhasil dihapus!");
    }
  };

  const deleteUser = (id) => {
    if (id === currentUser?.id) {
      alert("⚠️ Tidak bisa menghapus akun sendiri!");
      return;
    }
    if (confirm("Yakin hapus user ini?")) {
      setUsers(users.filter((u) => u.id !== id));
      alert("✓ User berhasil dihapus!");
    }
  };

  const getStudentAttendanceHistory = (studentId) => {
    const history = {};
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(new Date().setDate(new Date().getDate() - i));
      const dateStr = d.toISOString().split("T")[0];
      last30Days.push(dateStr);
    }
    last30Days.forEach((date) => {
      history[date] = getAttendanceStatus(studentId, date);
    });
    return history;
  };

  const calculatePercentage = (studentId) => {
    const history = getStudentAttendanceHistory(studentId);
    const hadirCount = Object.values(history).filter(
      (s) => s === "hadir",
    ).length;
    const totalDays = Object.values(history).filter(
      (s) => s !== "pending",
    ).length;
    return totalDays > 0 ? ((hadirCount / totalDays) * 100).toFixed(1) : 0;
  };

  const stats = calculateStats();

  const statusConfig = {
    hadir: {
      color: "#10b981",
      bg: "#ecfdf5",
      border: "#10b981",
      text: "#065f46",
      label: "Hadir",
      icon: CheckCircle,
    },
    sakit: {
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#f59e0b",
      text: "#92400e",
      label: "Sakit",
      icon: AlertCircle,
    },
    izin: {
      color: "#3b82f6",
      bg: "#eff6ff",
      border: "#3b82f6",
      text: "#1e3a8a",
      label: "Izin",
      icon: Clock,
    },
    alfa: {
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#ef4444",
      text: "#991b1b",
      label: "Alfa",
      icon: XCircle,
    },
    pending: {
      color: "#9ca3af",
      bg: "#f3f4f6",
      border: "#d1d5db",
      text: "#6b7280",
      label: "Belum Input",
      icon: Clock,
    },
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "input", label: "Input Absensi", icon: Plus },
    { id: "laporan", label: "Laporan", icon: FileText },
  ];
  const adminNavItems = [
    { id: "siswa", label: "Kelola Siswa", icon: Users },
    { id: "users", label: "Kelola User", icon: Lock },
  ];

  // ===== INLINE STYLES =====
  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #4f46e5, #4338ca, #1e1b4b)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem",
      fontFamily: "system-ui, -apple-system, sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "420px",
      backgroundColor: "rgba(255,255,255,0.96)",
      backdropFilter: "blur(8px)",
      borderRadius: "24px",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    header: {
      background: "linear-gradient(135deg, #4f46e5, #4338ca)",
      padding: "2rem",
      textAlign: "center",
      color: "white",
      position: "relative",
    },
    headerIcon: {
      width: "64px",
      height: "64px",
      background: "rgba(255,255,255,0.2)",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem auto",
      backdropFilter: "blur(4px)",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "700",
      letterSpacing: "-0.025em",
    },
    subtitle: {
      color: "#a5b4fc",
      marginTop: "0.25rem",
      fontWeight: "500",
    },
    body: {
      padding: "2rem",
    },
    tabContainer: {
      display: "flex",
      gap: "0.5rem",
      backgroundColor: "#f3f4f6",
      borderRadius: "12px",
      padding: "0.25rem",
      marginBottom: "2rem",
    },
    tabButton: {
      flex: 1,
      padding: "0.625rem 1rem",
      fontWeight: "600",
      borderRadius: "8px",
      border: "none",
      background: "transparent",
      transition: "all 0.2s",
      cursor: "pointer",
      fontSize: "0.95rem",
    },
    tabActive: {
      background: "white",
      color: "#4f46e5",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
    },
    tabInactive: {
      color: "#6b7280",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "0.375rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      backgroundColor: "#f9fafb",
      border: "2px solid #e5e7eb",
      borderRadius: "12px",
      outline: "none",
      transition: "all 0.2s",
      fontSize: "1rem",
    },
    inputWrapper: {
      position: "relative",
    },
    eyeButton: {
      position: "absolute",
      right: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      color: "#9ca3af",
      cursor: "pointer",
    },
    errorBox: {
      backgroundColor: "#fef2f2",
      borderLeft: "4px solid #ef4444",
      color: "#b91c1c",
      padding: "1rem",
      borderRadius: "12px",
      display: "flex",
      alignItems: "flex-start",
      gap: "0.75rem",
      fontSize: "0.875rem",
    },
    btnPrimary: {
      width: "100%",
      padding: "0.875rem",
      background: "linear-gradient(135deg, #4f46e5, #4338ca)",
      color: "white",
      fontWeight: "700",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      transition: "all 0.2s",
      boxShadow: "0 8px 16px -4px rgba(79,70,229,0.3)",
    },
    btnSuccess: {
      width: "100%",
      padding: "0.875rem",
      background: "linear-gradient(135deg, #059669, #047857)",
      color: "white",
      fontWeight: "700",
      borderRadius: "12px",
      border: "none",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: "0 8px 16px -4px rgba(5,150,105,0.3)",
    },
    linkText: {
      textAlign: "center",
      color: "#6b7280",
      fontSize: "0.875rem",
      marginTop: "1rem",
    },
    linkButton: {
      background: "none",
      border: "none",
      color: "#4f46e5",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "underline",
    },
    mainContainer: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)",
      padding: "1.5rem",
    },
    mainInner: {
      maxWidth: "1120px",
      margin: "0 auto",
    },
    headerMain: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    brandIcon: {
      width: "44px",
      height: "44px",
      backgroundColor: "rgba(99,102,241,0.2)",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid rgba(99,102,241,0.3)",
    },
    brandTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "white",
      letterSpacing: "-0.025em",
    },
    brandSub: {
      color: "rgba(165,180,252,0.7)",
      fontSize: "0.75rem",
      fontWeight: "500",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderRadius: "16px",
      padding: "0.75rem 1.25rem",
      border: "1px solid rgba(255,255,255,0.1)",
    },
    userText: {
      textAlign: "right",
    },
    userLabel: {
      fontSize: "0.75rem",
      color: "rgba(165,180,252,0.6)",
    },
    userName: {
      fontWeight: "700",
      color: "white",
      fontSize: "0.95rem",
    },
    userRole: {
      fontSize: "0.7rem",
      fontWeight: "500",
      color: "#fbbf24",
    },
    btnLogout: {
      backgroundColor: "rgba(244,63,94,0.2)",
      color: "#fda4af",
      border: "1px solid rgba(244,63,94,0.2)",
      padding: "0.5rem 1rem",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "0.875rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      transition: "all 0.2s",
    },
    navGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
      gap: "0.5rem",
      marginBottom: "2rem",
    },
    cardGlass: {
      backgroundColor: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(8px)",
      borderRadius: "16px",
      padding: "1.5rem",
      border: "1px solid rgba(255,255,255,0.1)",
      marginBottom: "1.5rem",
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    footer: {
      marginTop: "3rem",
      textAlign: "center",
      color: "rgba(165,180,252,0.3)",
      fontSize: "0.8rem",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      paddingTop: "2rem",
    },
  };

  // ===== RENDER =====
  if (!currentUser) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.headerIcon}>
              <Calendar size={32} color="white" />
            </div>
            <h1 style={styles.title}>Sistem Absensi</h1>
            <p style={styles.subtitle}>Sekolah Muslimin</p>
          </div>
          <div style={styles.body}>
            <div style={styles.tabContainer}>
              <button
                onClick={() => setAuthPage("login")}
                style={{
                  ...styles.tabButton,
                  ...(authPage === "login"
                    ? styles.tabActive
                    : styles.tabInactive),
                }}
              >
                Masuk
              </button>
              <button
                onClick={() => setAuthPage("register")}
                style={{
                  ...styles.tabButton,
                  ...(authPage === "register"
                    ? styles.tabActive
                    : styles.tabInactive),
                }}
              >
                Daftar
              </button>
            </div>

            {authPage === "login" && (
              <form
                onSubmit={handleLogin}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div>
                  <label style={styles.label}>Username</label>
                  <input
                    type="text"
                    value={loginData.username}
                    onChange={(e) =>
                      setLoginData({ ...loginData, username: e.target.value })
                    }
                    placeholder="Masukkan username"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Password</label>
                  <div style={styles.inputWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      placeholder="Masukkan password"
                      style={{ ...styles.input, paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                {authError && (
                  <div style={styles.errorBox}>
                    <AlertCircle
                      size={18}
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />
                    <span>{authError}</span>
                  </div>
                )}
                <button type="submit" style={styles.btnPrimary}>
                  Masuk <ArrowRight size={20} />
                </button>
                <p style={styles.linkText}>
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthPage("register")}
                    style={styles.linkButton}
                  >
                    Daftar di sini
                  </button>
                </p>
              </form>
            )}

            {authPage === "register" && (
              <form
                onSubmit={handleRegister}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label style={styles.label}>Nama Lengkap</label>
                  <input
                    type="text"
                    value={registerData.nama}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, nama: e.target.value })
                    }
                    placeholder="Masukkan nama lengkap"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Username</label>
                  <input
                    type="text"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        username: e.target.value,
                      })
                    }
                    placeholder="Pilih username"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Password</label>
                  <div style={styles.inputWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      placeholder="Minimal 6 karakter"
                      style={{ ...styles.input, paddingRight: "2.5rem" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={styles.label}>Konfirmasi Password</label>
                  <input
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Ketik ulang password"
                    style={styles.input}
                  />
                </div>
                {authError && (
                  <div style={styles.errorBox}>
                    <AlertCircle
                      size={18}
                      style={{ marginTop: "2px", flexShrink: 0 }}
                    />
                    <span>{authError}</span>
                  </div>
                )}
                <button type="submit" style={styles.btnSuccess}>
                  Buat Akun
                </button>
                <p style={styles.linkText}>
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthPage("login")}
                    style={styles.linkButton}
                  >
                    Masuk di sini
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN APP =====
  return (
    <div style={styles.mainContainer}>
      <div style={styles.mainInner}>
        <div style={styles.headerMain}>
          <div style={styles.brand}>
            <div style={styles.brandIcon}>
              <Calendar size={24} color="#818cf8" />
            </div>
            <div>
              <h1 style={styles.brandTitle}>Sistem Absensi</h1>
              <p style={styles.brandSub}>Sekolah Muslimin</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "block",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
            }}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <div style={{ display: "none", ...styles.userInfo }}>
            <div style={styles.userText}>
              <p style={styles.userLabel}>Login sebagai</p>
              <p style={styles.userName}>{currentUser.nama}</p>
              <span style={styles.userRole}>
                {currentUser.role === "admin"
                  ? "👑 Administrator"
                  : "👨‍🏫 Pengguna"}
              </span>
            </div>
            <button onClick={handleLogout} style={styles.btnLogout}>
              <LogOut size={16} /> Keluar
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{ ...styles.cardGlass, marginBottom: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={styles.userLabel}>Login sebagai</p>
                <p style={styles.userName}>{currentUser.nama}</p>
                <span style={styles.userRole}>
                  {currentUser.role === "admin"
                    ? "👑 Administrator"
                    : "👨‍🏫 Pengguna"}
                </span>
              </div>
              <button onClick={handleLogout} style={styles.btnLogout}>
                <LogOut size={16} /> Keluar
              </button>
            </div>
          </div>
        )}

        <div style={{ marginBottom: "2rem" }}>
          <div style={styles.navGrid}>
            {navItems.map((nav) => {
              const Icon = nav.icon;
              const active = currentView === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => {
                    setCurrentView(nav.id);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    padding: "0.75rem 0.5rem",
                    borderRadius: "16px",
                    fontWeight: "600",
                    background: active
                      ? "rgba(99,102,241,0.4)"
                      : "rgba(255,255,255,0.05)",
                    color: active ? "white" : "rgba(165,180,252,0.7)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    transition: "all 0.2s",
                    fontSize: "0.8rem",
                  }}
                >
                  <Icon size={20} />
                  <span>{nav.label}</span>
                </button>
              );
            })}
            {currentUser.role === "admin" &&
              adminNavItems.map((nav) => {
                const Icon = nav.icon;
                const active = currentView === nav.id;
                return (
                  <button
                    key={nav.id}
                    onClick={() => {
                      setCurrentView(nav.id);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      padding: "0.75rem 0.5rem",
                      borderRadius: "16px",
                      fontWeight: "600",
                      background: active
                        ? "rgba(99,102,241,0.4)"
                        : "rgba(255,255,255,0.05)",
                      color: active ? "white" : "rgba(165,180,252,0.7)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.25rem",
                      transition: "all 0.2s",
                      fontSize: "0.8rem",
                    }}
                  >
                    <Icon size={20} />
                    <span>{nav.label}</span>
                  </button>
                );
              })}
          </div>
        </div>

        {currentView === "dashboard" && (
          <div>
            <div style={styles.cardGlass}>
              <label
                style={{
                  color: "#cbd5e1",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                📅 Pilih Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  width: "100%",
                  maxWidth: "200px",
                }}
              />
            </div>

            <div style={styles.statsGrid}>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #10b98120, #10b98110)",
                  border: "1px solid #10b98140",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                  {stats.hadir}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Hadir</div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #f59e0b20, #f59e0b10)",
                  border: "1px solid #f59e0b40",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                  {stats.sakit}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Sakit</div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #3b82f620, #3b82f610)",
                  border: "1px solid #3b82f640",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                  {stats.izin}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Izin</div>
              </div>
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #ef444420, #ef444410)",
                  border: "1px solid #ef444440",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "700" }}>
                  {stats.alfa}
                </div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Alfa</div>
              </div>
            </div>

            <div style={styles.cardGlass}>
              <h2
                style={{
                  color: "white",
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Status Absensi — {selectedDate}
              </h2>
              {students.map((student) => {
                const status = getAttendanceStatus(student.id, selectedDate);
                const cfg = statusConfig[status];
                const Icon = cfg.icon;
                return (
                  <div
                    key={student.id}
                    style={{
                      padding: "1rem",
                      borderRadius: "12px",
                      borderLeft: `4px solid ${cfg.border}`,
                      background: cfg.bg,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "600", color: cfg.text }}>
                        {student.nama}
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#6b7280",
                          marginLeft: "0.5rem",
                        }}
                      >
                        {student.kelas} · NISN: {student.nisn}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        color: cfg.text,
                      }}
                    >
                      <Icon size={14} />
                      <span>{cfg.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentView === "input" && (
          <div style={styles.cardGlass}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  color: "#cbd5e1",
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                📅 Pilih Tanggal Input
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  width: "100%",
                  maxWidth: "200px",
                }}
              />
            </div>
            <h2
              style={{
                color: "white",
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
              }}
            >
              Input Absensi — {selectedDate}
            </h2>
            {students.map((student) => {
              const status = getAttendanceStatus(student.id, selectedDate);
              return (
                <div
                  key={student.id}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span style={{ color: "white", fontWeight: "600" }}>
                      {student.nama}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.8rem",
                      }}
                    >
                      {status !== "pending"
                        ? `Status: ${statusConfig[status].label}`
                        : "Belum diisi"}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {["hadir", "sakit", "izin", "alfa"].map((s) => {
                      const cfg = statusConfig[s];
                      const active = status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => handleAttendanceChange(student.id, s)}
                          style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "12px",
                            border: "none",
                            fontWeight: "600",
                            background: active
                              ? cfg.color
                              : "rgba(255,255,255,0.1)",
                            color: active ? "white" : "rgba(255,255,255,0.6)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.8rem",
                          }}
                        >
                          <cfg.icon size={14} />
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(16,185,129,0.15)",
                borderRadius: "12px",
                border: "1px solid rgba(16,185,129,0.3)",
                color: "#6ee7b7",
              }}
            >
              <CheckCircle
                size={18}
                style={{ display: "inline", marginRight: "0.5rem" }}
              />
              Data tersimpan secara otomatis
            </div>
          </div>
        )}

        {currentView === "laporan" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {students.map((student) => {
              const percentage = calculatePercentage(student.id);
              const history = getStudentAttendanceHistory(student.id);
              const hadirDays = Object.values(history).filter(
                (s) => s === "hadir",
              ).length;
              const totalDays = Object.values(history).filter(
                (s) => s !== "pending",
              ).length;
              const isLow = percentage < 80;
              return (
                <div key={student.id} style={styles.cardGlass}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "rgba(99,102,241,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {student.nama.charAt(0)}
                    </div>
                    <div>
                      <h3 style={{ color: "white", fontWeight: "700" }}>
                        {student.nama}
                      </h3>
                      <p
                        style={{
                          color: "rgba(165,180,252,0.6)",
                          fontSize: "0.75rem",
                        }}
                      >
                        {student.kelas} · {student.nisn}
                      </p>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          color: "rgba(165,180,252,0.7)",
                          fontSize: "0.9rem",
                        }}
                      >
                        Persentase Kehadiran
                      </span>
                      <span
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: isLow ? "#f87171" : "#34d399",
                        }}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: "9999px",
                        height: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: isLow
                            ? "#ef4444"
                            : "linear-gradient(to right, #34d399, #10b981)",
                          borderRadius: "9999px",
                          transition: "width 1s",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                      marginTop: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        borderRadius: "12px",
                        padding: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: "#34d399",
                        }}
                      >
                        {hadirDays}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "rgba(165,180,252,0.6)",
                        }}
                      >
                        Hadir
                      </div>
                    </div>
                    <div
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: "12px",
                        padding: "0.5rem",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "700",
                          color: "#f87171",
                        }}
                      >
                        {totalDays - hadirDays}
                      </div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          color: "rgba(165,180,252,0.6)",
                        }}
                      >
                        Tidak Hadir
                      </div>
                    </div>
                  </div>
                  {isLow && (
                    <div
                      style={{
                        marginTop: "0.75rem",
                        padding: "0.5rem",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <AlertCircle size={18} color="#f87171" />
                      <span style={{ color: "#fca5a5", fontSize: "0.8rem" }}>
                        ⚠️ Kehadiran di bawah 80%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {currentView === "siswa" && currentUser.role === "admin" && (
          <div>
            <div style={styles.cardGlass}>
              <h2
                style={{
                  color: "white",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Tambah Siswa Baru
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto",
                  gap: "0.75rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Nama Siswa"
                  value={newStudent.nama}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, nama: e.target.value })
                  }
                  style={{
                    ...styles.input,
                    background: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
                <input
                  type="text"
                  placeholder="Kelas"
                  value={newStudent.kelas}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, kelas: e.target.value })
                  }
                  style={{
                    ...styles.input,
                    background: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
                <input
                  type="text"
                  placeholder="NISN"
                  value={newStudent.nisn}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, nisn: e.target.value })
                  }
                  style={{
                    ...styles.input,
                    background: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
                <button
                  onClick={addStudent}
                  style={{
                    ...styles.btnPrimary,
                    padding: "0.75rem 1.5rem",
                    width: "auto",
                  }}
                >
                  <Plus size={20} /> Tambah
                </button>
              </div>
            </div>
            <div style={styles.cardGlass}>
              <h2
                style={{
                  color: "white",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Daftar Siswa ({students.length})
              </h2>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    textAlign: "left",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.9rem",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <th style={{ padding: "0.75rem" }}>No</th>
                      <th style={{ padding: "0.75rem" }}>Nama</th>
                      <th style={{ padding: "0.75rem" }}>Kelas</th>
                      <th style={{ padding: "0.75rem" }}>NISN</th>
                      <th style={{ padding: "0.75rem" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr
                        key={s.id}
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <td style={{ padding: "0.75rem" }}>{i + 1}</td>
                        <td style={{ padding: "0.75rem", fontWeight: "600" }}>
                          {s.nama}
                        </td>
                        <td style={{ padding: "0.75rem" }}>{s.kelas}</td>
                        <td style={{ padding: "0.75rem" }}>{s.nisn}</td>
                        <td style={{ padding: "0.75rem" }}>
                          <button
                            onClick={() => deleteStudent(s.id)}
                            style={{
                              color: "#f87171",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Trash2 size={16} /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentView === "users" && currentUser.role === "admin" && (
          <div style={styles.cardGlass}>
            <h2
              style={{
                color: "white",
                fontWeight: "700",
                marginBottom: "1rem",
              }}
            >
              Daftar User ({users.length})
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  textAlign: "left",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.9rem",
                }}
              >
                <thead>
                  <tr
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <th style={{ padding: "0.75rem" }}>No</th>
                    <th style={{ padding: "0.75rem" }}>Nama</th>
                    <th style={{ padding: "0.75rem" }}>Username</th>
                    <th style={{ padding: "0.75rem" }}>Role</th>
                    <th style={{ padding: "0.75rem" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <td style={{ padding: "0.75rem" }}>{i + 1}</td>
                      <td style={{ padding: "0.75rem", fontWeight: "600" }}>
                        {u.nama}
                      </td>
                      <td style={{ padding: "0.75rem" }}>{u.username}</td>
                      <td style={{ padding: "0.75rem" }}>
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            background:
                              u.role === "admin"
                                ? "rgba(251,191,36,0.2)"
                                : "rgba(99,102,241,0.2)",
                            color: u.role === "admin" ? "#fbbf24" : "#818cf8",
                          }}
                        >
                          {u.role === "admin" ? "👑 Admin" : "👨‍🏫 User"}
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem" }}>
                        {u.id !== currentUser.id ? (
                          <button
                            onClick={() => deleteUser(u.id)}
                            style={{
                              color: "#f87171",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Trash2 size={16} /> Hapus
                          </button>
                        ) : (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.3)",
                              fontSize: "0.8rem",
                            }}
                          >
                            Akun aktif
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <p>💻 Sistem Informasi Absensi Sekolah Muslimin</p>
          <p style={{ marginTop: "0.25rem" }}>
            Implementasi Agile dalam Manajemen Kebutuhan RPL | NIM: 2455201046
          </p>
        </div>
      </div>
    </div>
  );
}

import mongoose from "mongoose";
import dns from "dns";

// Fix: DNS của router/nhà mạng thường chặn hoặc từ chối resolve DNS SRV (_mongodb._tcp)
// Sử dụng public DNS (Google DNS 8.8.8.8 & Cloudflare 1.1.1.1) để resolve mongodb+srv://
try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
    console.warn("Could not set custom DNS servers:", e.message);
}
dns.setDefaultResultOrder("ipv4first");

const db = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${process.env.DB_NAME}`,
            {
                serverSelectionTimeoutMS: 10000, // Timeout 10s thay vì 30s mặc định
                socketTimeoutMS: 45000,
                family: 4, // Force IPv4
            }
        );
        console.log(`\n✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default db;
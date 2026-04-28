import 'package:flutter/material.dart';
import 'package:myapp/pages/home/screens/booking_screen.dart';

class DoctorProfileScreen extends StatelessWidget {
  final Map<String, dynamic> doctor;

  const DoctorProfileScreen({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      // Dùng CustomScrollView để có hiệu ứng cuộn mượt mà
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              // 1. AppBar với nút Back và Favorite
              SliverAppBar(
                expandedHeight: 0,
                pinned: true,
                backgroundColor: Colors.white,
                elevation: 0,
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back_ios, color: Colors.black, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
                actions: [
                  IconButton(
                    icon: const Icon(Icons.favorite_border, color: Colors.black),
                    onPressed: () {},
                  ),
                  IconButton(
                    icon: const Icon(Icons.share_outlined, color: Colors.black),
                    onPressed: () {},
                  ),
                ],
              ),

              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 2. Thông tin chính (Ảnh, Tên, Chuyên khoa)
                      _buildHeaderSection(),
                      
                      const SizedBox(height: 30),

                      // 3. Hàng thông số (Kinh nghiệm, Bệnh nhân, Đánh giá)
                      _buildStatsSection(),
                      
                      const SizedBox(height: 30),

                      // 4. Giới thiệu chi tiết
                      const Text(
                        "Giới thiệu",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "Bác sĩ có hơn 10 năm kinh nghiệm trong lĩnh vực ${doctor['specialty']}. Từng công tác và giữ các chức vụ quan trọng tại ${doctor['hospital']}. Bác sĩ nổi tiếng với sự tận tâm và phương pháp điều trị hiện đại, giúp hàng nghìn bệnh nhân hồi phục nhanh chóng.",
                        style: TextStyle(
                          color: Colors.grey[700],
                          fontSize: 15,
                          height: 1.6,
                        ),
                      ),
                      
                      const SizedBox(height: 30),

                      // 5. Nơi làm việc (Địa chỉ thực tế)
                      const Text(
                        "Nơi làm việc",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      _buildLocationTile(),

                      const SizedBox(height: 120), // Khoảng trống để không bị đè bởi nút dưới cùng
                    ],
                  ),
                ),
              ),
            ],
          ),

          // 6. Nút Đặt lịch cố định ở dưới cùng
          _buildBottomActionButton(context),
        ],
      ),
    );
  }

  // --- Widget Components ---

  Widget _buildHeaderSection() {
    return Row(
      children: [
        // Ảnh bác sĩ
        Container(
          width: 120,
          height: 140,
          decoration: BoxDecoration(
            color: Colors.blue[50],
            borderRadius: BorderRadius.circular(20),
            image: const DecorationImage(
              image: NetworkImage("https://via.placeholder.com/150"), // Thay bằng ảnh bác sĩ thật
              fit: BoxFit.cover,
            ),
          ),
        ),
        const SizedBox(width: 20),
        // Tên và Chuyên khoa
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                doctor['name'],
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFF00B4D8).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  doctor['specialty'],
                  style: const TextStyle(
                    color: Color(0xFF00B4D8),
                    fontWeight: FontWeight.w600,
                    fontSize: 13,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                doctor['hospital'],
                style: const TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatsSection() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _buildStatItem("10+", "Năm KN"),
        _buildStatItem("2.5k+", "Bệnh nhân"),
        _buildStatItem(doctor['rating'].toString(), "Đánh giá"),
      ],
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Container(
      width: 100,
      padding: const EdgeInsets.symmetric(vertical: 15),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF00B4D8),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationTile() {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.orange[50],
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.location_on, color: Colors.orange),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(doctor['hospital'], style: const TextStyle(fontWeight: FontWeight.bold)),
                const Text("Thành phố Thái Bình, Việt Nam", style: TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActionButton(BuildContext context) {
    return Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        padding: const EdgeInsets.fromLTRB(20, 15, 20, 30),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => BookingScreen(doctor: doctor),
              ),
            );
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF00B4D8),
            minimumSize: const Size(double.infinity, 55),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
            elevation: 0,
          ),
          child: const Text(
            "Đặt lịch khám ngay",
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
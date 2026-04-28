import 'package:flutter/material.dart';

class SelectProfileScreen extends StatefulWidget {
  final Map<String, dynamic> bookingData; // Nhận dữ liệu từ trang Scheduling

  const SelectProfileScreen({super.key, required this.bookingData});

  @override
  State<SelectProfileScreen> createState() => _SelectProfileScreenState();
}

class _SelectProfileScreenState extends State<SelectProfileScreen> {
  int selectedProfileIndex = 0;

  // Giả lập danh sách hồ sơ bệnh nhân của người dùng
  final List<Map<String, String>> profiles = [
    {"name": "Việt Anh", "relationship": "Bản thân", "age": "21", "gender": "Nam"},
    {"name": "Nguyễn Văn B", "relationship": "Bố", "age": "55", "gender": "Nam"},
    {"name": "Trần Thị C", "relationship": "Mẹ", "age": "50", "gender": "Nữ"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text("Chọn hồ sơ bệnh nhân", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Ai sẽ là người khám?",
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            const SizedBox(height: 20),

            // Danh sách hồ sơ
            Expanded(
              child: ListView.builder(
                itemCount: profiles.length + 1, // +1 cho nút "Thêm hồ sơ mới"
                itemBuilder: (context, index) {
                  if (index == profiles.length) {
                    return _buildAddProfileButton();
                  }
                  return _buildProfileItem(index);
                },
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildContinueButton(),
    );
  }

  Widget _buildProfileItem(int index) {
    bool isSelected = selectedProfileIndex == index;
    var profile = profiles[index];

    return GestureDetector(
      onTap: () => setState(() => selectedProfileIndex = index),
      child: Container(
        margin: const EdgeInsets.only(bottom: 15),
        padding: const EdgeInsets.all(15),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF00B4D8).withOpacity(0.05) : Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(
            color: isSelected ? const Color(0xFF00B4D8) : Colors.grey.shade200,
            width: 2,
          ),
        ),
        child: Row(
          children: [
            CircleAvatar(
              backgroundColor: isSelected ? const Color(0xFF00B4D8) : Colors.grey[200],
              child: Icon(Icons.person, color: isSelected ? Colors.white : Colors.grey),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(profile['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  Text("${profile['relationship']} • ${profile['age']} tuổi", style: const TextStyle(color: Colors.grey, fontSize: 13)),
                ],
              ),
            ),
            if (isSelected) const Icon(Icons.check_circle, color: Color(0xFF00B4D8)),
          ],
        ),
      ),
    );
  }

  Widget _buildAddProfileButton() {
    return GestureDetector(
      onTap: () {
        // Logic thêm hồ sơ mới
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 15),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
          borderRadius: BorderRadius.circular(15),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.add_circle_outline, color: Colors.grey),
            SizedBox(width: 10),
            Text("Thêm hồ sơ mới", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildContinueButton() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
      decoration: const BoxDecoration(color: Colors.white),
      child: ElevatedButton(
        onPressed: () {
          // Chuyển đến màn hình Xác nhận đơn đặt (Summary)
          // Truyền cả thông tin booking và hồ sơ đã chọn
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFF00B4D8),
          minimumSize: const Size(double.infinity, 55),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        ),
        child: const Text("Tiếp tục", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
      ),
    );
  }
}
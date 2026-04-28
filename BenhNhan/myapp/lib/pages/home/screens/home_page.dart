import 'package:flutter/material.dart';
import 'package:myapp/pages/home/screens/category_screen.dart';
import 'package:myapp/pages/home/widgets/category_item.dart';
import 'package:myapp/pages/home/widgets/doctor_card.dart';
import 'package:myapp/pages/home/widgets/header.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _isExpanded = false;

  final List<Map<String, dynamic>> _categories = [
    {"title": "Nha khoa", "icon": Icons.biotech, "color": Colors.blue},
    {"title": "Tim mạch", "icon": Icons.favorite, "color": Colors.red},
    {"title": "Xương khớp", "icon": Icons.healing, "color": Colors.orange},
    {"title": "Mắt", "icon": Icons.visibility, "color": Colors.green},
    {"title": "Tai mũi họng", "icon": Icons.hearing, "color": Colors.purple},
    {"title": "Da liễu", "icon": Icons.face, "color": Colors.pink},
    {"title": "Tiêu hóa", "icon": Icons.restaurant, "color": Colors.brown},
    {"title": "Thần kinh", "icon": Icons.psychology, "color": Colors.teal},
    {"title": "Nhi khoa", "icon": Icons.child_care, "color": Colors.cyan},
    {"title": "Sản phụ", "icon": Icons.pregnant_woman, "color": Colors.indigo},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Header(),
            const SizedBox(height: 24),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    "Chuyên Khoa",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  AnimatedSize(
                    duration: const Duration(milliseconds: 300),
                    alignment: Alignment.topCenter,
                    child: _buildCategories(),
                  ),
                  if (_categories.length > 8)
                    Center(
                      child: IconButton(
                        icon: Icon(
                          _isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                          size: 30,
                        ),
                        color: Colors.grey,
                        onPressed: () => setState(() => _isExpanded = !_isExpanded),
                      ),
                    ),
                ]
              ),
            ),
            const SizedBox(height: 24),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    "Bác sĩ nổi bật",
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  TextButton(onPressed: () {}, child: const Text("Xem tất cả")),
                ],
              ),
            ),

            const SizedBox(height: 10),

            SizedBox(
              height: 200,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.only(left: 20),
                children: [
                DoctorCard(
                  name: "Bs. Nguyễn Văn A",
                  job: "Tim mạch",
                  rating: 4.8,
                  bgColor: Colors.blue.shade100,
                ),
                DoctorCard(
                  name: "Bs. Trần Thị B",
                  job: "Nha sĩ",
                  rating: 4.9,
                  bgColor: Colors.green.shade100,
                ),
                DoctorCard(
                  name: "Bs. Trần Thị B",
                  job: "Nha sĩ",
                  rating: 4.9,
                  bgColor: Colors.green.shade100,
                ),
                DoctorCard(
                  name: "Bs. Trần Thị B",
                  job: "Nha sĩ",
                  rating: 4.9,
                  bgColor: Colors.green.shade100,
                ),
                ],
              ),
            ),
            const SizedBox(height: 120),
          ],
        ),
      ),
    );
  }

  Widget _buildCategories() {
    int itemCount = _isExpanded ? _categories.length : (_categories.length > 8 ? 8 : _categories.length);
    List<Widget> rows = [];
    
    for (int i = 0; i < itemCount; i += 4) {
      List<Widget> rowChildren = [];
      for (int j = 0; j < 4; j++) {
        if (i + j < itemCount) {
          final cat = _categories[i + j];
          rowChildren.add(
            Expanded(
              child: CategoryItem(
                title: cat['title'] as String,
                icon: cat['icon'] as IconData,
                color: cat['color'] as Color,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SpecialtyResultScreen(specialtyName: cat['title'] as String),
                    ),
                  );
                },
              ),
            ),
          );
        } else {
          rowChildren.add(const Expanded(child: SizedBox())); // Giữ khoảng cách chuẩn nếu hàng cuối không đủ 4 item
        }
      }
      rows.add(Row(crossAxisAlignment: CrossAxisAlignment.start, children: rowChildren));
      if (i + 4 < itemCount) rows.add(const SizedBox(height: 16));
    }
    return Column(children: rows);
  }
}
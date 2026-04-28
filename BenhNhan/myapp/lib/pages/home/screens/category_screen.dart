import 'package:flutter/material.dart';
import 'package:myapp/pages/home/screens/doctor_screen.dart';

class SpecialtyResultScreen extends StatefulWidget {
  final String specialtyName;

  const SpecialtyResultScreen({super.key, required this.specialtyName});

  @override
  State<SpecialtyResultScreen> createState() => _SpecialtyResultScreenState();
}

class _SpecialtyResultScreenState extends State<SpecialtyResultScreen> {
  int selectedServiceIndex = 0;

  final List<Map<String, String>> services = [
    {"name": "Tất cả", "price": ""},
    {"name": "Nhổ răng khôn", "price": "1.500.000đ"},
    {"name": "Tẩy trắng răng", "price": "2.000.000đ"},
    {"name": "Hàn răng sâu", "price": "300.000đ"},
  ];

  final List<Map<String, dynamic>> allDoctors = [
    {
      "name": "Bs. Nguyễn Văn A",
      "hospital": "BV Đa khoa Thái Bình",
      "rating": 4.9,
      "reviews": 120,
      "canDo": ["Nhổ răng khôn", "Hàn răng sâu"]
    },
    {
      "name": "Bs. Trần Thị B",
      "hospital": "Phòng khám Quốc tế",
      "rating": 4.8,
      "reviews": 85,
      "canDo": ["Tẩy trắng răng"]
    },
  ];

  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> filteredDoctors = allDoctors.where((doc) {
      if (selectedServiceIndex == 0) return true;
      return doc['canDo'].contains(services[selectedServiceIndex]['name']);
    }).toList();

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 150.0,
            pinned: true,
            backgroundColor: const Color(0xFF00B4D8),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              title: Text(widget.specialtyName, 
                style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF00B4D8), Color(0xFF48CAE4)],
                  ),
                ),
                child: Center(
                  child: Icon(Icons.medical_information, size: 80, color: Colors.white.withOpacity(0.2)),
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text("Chọn dịch vụ cần khám", 
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 45,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: services.length,
                      itemBuilder: (context, index) {
                        bool isSelected = selectedServiceIndex == index;
                        return GestureDetector(
                          onTap: () => setState(() => selectedServiceIndex = index),
                          child: Container(
                            margin: const EdgeInsets.only(right: 10),
                            padding: const EdgeInsets.symmetric(horizontal: 20),
                            decoration: BoxDecoration(
                              color: isSelected ? const Color(0xFF00B4D8) : Colors.grey[100],
                              borderRadius: BorderRadius.circular(25),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              services[index]['name']!,
                              style: TextStyle(
                                color: isSelected ? Colors.white : Colors.black87,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  if (selectedServiceIndex != 0)
                    Padding(
                      padding: const EdgeInsets.only(top: 10, left: 5),
                      child: Text("Giá tham khảo: ${services[selectedServiceIndex]['price']}",
                        style: const TextStyle(color: Colors.blueGrey, fontStyle: FontStyle.italic)),
                    ),
                ],
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  return _buildDoctorItem(filteredDoctors[index]);
                },
                childCount: filteredDoctors.length,
              ),
            ),
          ),
          
          if (filteredDoctors.isEmpty)
            const SliverToBoxAdapter(
              child: Center(child: Padding(
                padding: EdgeInsets.only(top: 50),
                child: Text("Hiện chưa có bác sĩ cho dịch vụ này"),
              )),
            )
        ],
      ),
    );
  }

  Widget _buildDoctorItem(Map<String, dynamic> doctor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
      ),
      child: Row(
        children: [
          Container(
            width: 80, height: 80,
            decoration: BoxDecoration(color: Colors.cyan[50], borderRadius: BorderRadius.circular(15)),
            child: const Icon(Icons.person, size: 40, color: Color(0xFF00B4D8)),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(doctor['name'], style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text(doctor['hospital'], style: const TextStyle(color: Colors.blueAccent, fontSize: 12)),
                const SizedBox(height: 5),
                Wrap(
                  spacing: 4,
                  children: (doctor['canDo'] as List<String>).map((s) => 
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(4)),
                      child: Text(s, style: const TextStyle(fontSize: 10, color: Colors.black54)),
                    )
                  ).toList(),
                )
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => DoctorProfileScreen(
                    doctor: {
                      ...doctor,
                      'specialty': widget.specialtyName,
                    },
                  ),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF00B4D8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 0,
            ),
            child: const Text("Đặt", style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }
}
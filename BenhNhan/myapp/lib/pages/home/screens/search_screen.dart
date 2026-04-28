import 'package:flutter/material.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  
  List<Map<String, dynamic>> allDoctors = [
    {"name": "Bs. Nguyễn Văn A", "specialty": "Tim mạch", "rating": 4.9, "image": ""},
    {"name": "Bs. Trần Thị B", "specialty": "Nha khoa", "rating": 4.8, "image": ""},
    {"name": "Bs. Lê Văn C", "specialty": "Ngoại thần kinh", "rating": 5.0, "image": ""},
  ];

  List<Map<String, dynamic>> displayList = [];
  
  String _selectedSpecialty = 'Tất cả';
  double _minRating = 0.0;

  @override
  void initState() {
    displayList = List.from(allDoctors);
    super.initState();
  }

  void _applyFilters() {
    String searchText = _searchController.text.toLowerCase();
    setState(() {
      displayList = allDoctors.where((doctor) {
        bool matchText = doctor['name']!.toLowerCase().contains(searchText) ||
            doctor['specialty']!.toLowerCase().contains(searchText);
        bool matchSpecialty = _selectedSpecialty == 'Tất cả' || doctor['specialty'] == _selectedSpecialty;
        bool matchRating = doctor['rating'] >= _minRating;
        
        return matchText && matchSpecialty && matchRating;
      }).toList();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          "Tìm kiếm bác sĩ",
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (value) => _applyFilters(),
                      decoration: const InputDecoration(
                        hintText: "Tìm kiếm bác sĩ, chuyên khoa...",
                        prefixIcon: Icon(Icons.search, color: Colors.grey),
                        border: InputBorder.none,
                        contentPadding: EdgeInsets.symmetric(vertical: 15),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 15),
                GestureDetector(
                  onTap: () => _showFilterBottomSheet(),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFF00B4D8),
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: const Icon(Icons.tune, color: Colors.white),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 25),

            if (_searchController.text.isEmpty) 
              Center(
                child: Text("Vui lòng tìm kiếm bác sĩ, chuyên khoa...", style: TextStyle(color: Colors.grey.shade400)),
              ),

            // 3. Search Results
            if (_searchController.text.isNotEmpty)...[ const Text(
              "Kết quả tìm kiếm",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 15),
            
            Expanded(
              child: displayList.isEmpty
                  ? const Center(child: Text("Không tìm thấy bác sĩ nào!"))
                  : ListView.builder(
                      itemCount: displayList.length,
                      itemBuilder: (context, index) {
                        return _buildSearchItem(displayList[index]);
                      },
                    ),
            ),
          ],
          ]
        ),
      ),
    );
  }

  Widget _buildSearchItem(Map<String, dynamic> doctor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        children: [
          Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              color: Colors.cyan.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.person, size: 40, color: Colors.cyan),
          ),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  doctor['name'],
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Text(
                  doctor['specialty'],
                  style: const TextStyle(color: Colors.grey, fontSize: 13),
                ),
                const SizedBox(height: 5),
                Row(
                  children: [
                    const Icon(Icons.star, color: Colors.orange, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      doctor['rating'].toString(),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ],
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () {},
            icon: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
          )
        ],
      ),
    );
  }

  void _showFilterBottomSheet() {
    List<String> specialties = ['Tất cả', ...allDoctors.map((e) => e['specialty'] as String).toSet()];
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.all(25.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Center(
                    child: Text("Lọc kết quả", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 25),
                  const Text("Chuyên khoa", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    children: specialties.map((spec) {
                      return ChoiceChip(
                        label: Text(spec),
                        selected: _selectedSpecialty == spec,
                        selectedColor: Colors.cyan.shade100,
                        onSelected: (selected) {
                          setModalState(() => _selectedSpecialty = spec);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 25),
                  const Text("Đánh giá (Tối thiểu)", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    children: [
                      {'label': 'Tất cả', 'value': 0.0},
                      {'label': 'Từ 4.0 ⭐', 'value': 4.0},
                      {'label': 'Từ 4.5 ⭐', 'value': 4.5},
                      {'label': '5.0 ⭐', 'value': 5.0},
                    ].map((ratingMap) {
                      return ChoiceChip(
                        label: Text(ratingMap['label'] as String),
                        selected: _minRating == ratingMap['value'],
                        selectedColor: Colors.orange.shade100,
                        onSelected: (selected) {
                          setModalState(() => _minRating = ratingMap['value'] as double);
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 35),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setModalState(() {
                              _selectedSpecialty = 'Tất cả';
                              _minRating = 0.0;
                            });
                            _applyFilters();
                          },
                          style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 15)),
                          child: const Text("Đặt lại"),
                        ),
                      ),
                      const SizedBox(width: 15),
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF00B4D8),
                            padding: const EdgeInsets.symmetric(vertical: 15),
                          ),
                          onPressed: () {
                            _applyFilters();
                            Navigator.pop(context); // Đóng bottom sheet
                          },
                          child: const Text("Áp dụng", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }
}
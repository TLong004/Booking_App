import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/models/doctor.dart';
import 'package:myapp/models/specialty.dart';
import 'package:myapp/pages/home/widgets/doctor_item.dart';
import 'package:myapp/logic/doctor/doctor_bloc.dart';
import 'package:myapp/logic/specialty/specialty_bloc.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  
  String _selectedSpecialty = 'Tất cả';
  double _minRating = 0.0;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
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
            _buildSearchHeader(),

            const SizedBox(height: 25),

            Expanded(
              child: BlocBuilder<DoctorBloc, DoctorState>(
                builder: (context, state) {
                  if (_searchController.text.isEmpty) {
                    return _buildEmptyState("Hãy nhập tên bác sĩ để bắt đầu...");
                  }

                  if (state is DoctorLoading) {
                    return const Center(
                      child: CircularProgressIndicator(color: Color(0xFF00B4D8)),
                    );
                  }

                  if (state is DoctorLoaded) {
                    final filteredList = state.doctors.where((doctor) {
                      bool matchSpecialty = _selectedSpecialty == 'Tất cả' || doctor.specialtyName == _selectedSpecialty;
                      bool matchRating = doctor.rating! >= _minRating;
                      return matchSpecialty && matchRating;
                    }).toList();

                    if (filteredList.isEmpty) {
                      return _buildEmptyState("Không tìm thấy bác sĩ nào phù hợp!");
                    }

                    return _buildResultList(filteredList);
                  }

                  if (state is DoctorError) {
                    return _buildEmptyState(state.message);
                  }

                  return _buildEmptyState("Vui lòng nhập từ khóa tìm kiếm...");
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- Widget Components ---

  Widget _buildSearchHeader() {
    return Row(
      children: [
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(15),
            ),
            child: TextField(
              controller: _searchController,
              onChanged: (value) {
                context.read<DoctorBloc>().add(SearchDoctors(value));
              },
              decoration: const InputDecoration(
                hintText: "Tìm kiếm bác sĩ...",
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
    );
  }

  Widget _buildResultList(List<DoctorModel> doctors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          "Kết quả tìm kiếm",
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 15),
        Expanded(
          child: ListView.builder(
            itemCount: doctors.length,
            itemBuilder: (context, index) {
              return DoctorItem(doctor: doctors[index]);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(String msg) {
    return Center(
      child: Text(
        msg,
        textAlign: TextAlign.center,
        style: TextStyle(color: Colors.grey.shade400, fontSize: 14),
      ),
    );
  }

  void _showFilterBottomSheet() {
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
                    child: Text("Lọc kết quả", 
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 25),
                  const Text("Chuyên khoa", 
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 10),

                  BlocBuilder<SpecialtyBloc, SpecialtyState>(
                    builder: (context, state) {
                      if (state is SpecialtyLoading) {
                        return const Center(child: CircularProgressIndicator());
                      }

                      List<SpecialtyModel> listSpecialties = [];
                      if (state is SpecialtyLoaded) {
                        listSpecialties = state.specialties;
                      }

                      return Wrap(
                        spacing: 10,
                        children: [
                          ChoiceChip(
                            label: const Text("Tất cả"),
                            selected: _selectedSpecialty == 'Tất cả', 
                            selectedColor: Colors.cyan.shade100,
                            onSelected: (selected) {
                              setModalState(() => _selectedSpecialty = 'Tất cả');
                              setState(() {});
                            },
                          ),
                          
                          ...listSpecialties.map((spec) {
                            return ChoiceChip(
                              label: Text(spec.name), 
                              selected: _selectedSpecialty == spec.name, 
                              selectedColor: Colors.cyan.shade100,
                              onSelected: (selected) {
                                setModalState(() {
                                  _selectedSpecialty = spec.name;
                                });
                                setState(() {});
                              },
                            );
                          }).toList(),
                        ],
                      );
                    },
                  ),

                  const SizedBox(height: 25),
                  const Text("Đánh giá (Tối thiểu)", 
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 10),
                  
                  Wrap(
                    spacing: 10,
                    children: [0.0, 4.0, 4.5, 5.0].map((r) {
                      return ChoiceChip(
                        label: Text(r == 0.0 ? "Tất cả" : "Từ $r ⭐"),
                        selected: _minRating == r,
                        selectedColor: Colors.orange.shade100,
                        onSelected: (selected) {
                          setModalState(() => _minRating = r);
                          setState(() {});
                        },
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 35),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF00B4D8),
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: const Text("Áp dụng", 
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
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
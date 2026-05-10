import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/models/specialty.dart';
import 'package:myapp/pages/home/screens/category_screen.dart';
import 'package:myapp/pages/home/widgets/category_item.dart';
import 'package:myapp/pages/home/widgets/doctor_card.dart';
import 'package:myapp/pages/home/widgets/header.dart';
import 'package:myapp/logic/specialty/specialty_bloc.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _isExpanded = false;

  @override
  void initState() {
    super.initState();
    context.read<SpecialtyBloc>().add(FetchSpecialties());
  }

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
            BlocBuilder<SpecialtyBloc, SpecialtyState>(
              builder: (context, state) {
                if (state is SpecialtyLoading) {
                  return const Center(child: CircularProgressIndicator());
                } else if (state is SpecialtyLoaded) {
                  final specialties = state.specialties;
                  
                  return Padding(
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
                          child: _buildCategories(specialties), 
                        ),
                        if (specialties.length > 8)
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
                      ],
                    ),
                  );
                } else if (state is SpecialtyError) {
                  return Center(child: Text(state.message));
                }
                return const SizedBox.shrink();
              },
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

  Widget _buildCategories(List<SpecialtyModel> specialties) {
    int itemCount = _isExpanded
        ? specialties.length
        : (specialties.length > 8 ? 8 : specialties.length);
    
    List<Widget> rows = [];

    for (int i = 0; i < itemCount; i += 4) {
      List<Widget> rowChildren = [];
      for (int j = 0; j < 4; j++) {
        if (i + j < itemCount) {
          final specialty = specialties[i + j];
          rowChildren.add(
            Expanded(
              child: CategoryItem(
                title: specialty.name,
                icon: _getIconForSpecialty(specialty.name), 
                color: const Color(0xFF00B4D8).withOpacity(0.1),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SpecialtyResultScreen(
                        specialtyName: specialty.name,
                        specialtyId: specialty.id!,
                      ),
                    ),
                  );
                },
              ),
            ),
          );
        } else {
          rowChildren.add(const Expanded(child: SizedBox()));
        }
      }
      rows.add(Row(crossAxisAlignment: CrossAxisAlignment.start, children: rowChildren));
      if (i + 4 < itemCount) rows.add(const SizedBox(height: 16));
    }
    return Column(children: rows);
  }

  IconData _getIconForSpecialty(String name) {
    if (name.contains("Tim mạch")) return Icons.favorite;
    if (name.contains("Nha khoa")) return Icons.medical_services;
    return Icons.health_and_safety;
  }
}
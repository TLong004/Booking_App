import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/models/doctor.dart';
import 'package:myapp/models/service.dart';
import 'package:myapp/pages/home/widgets/doctor_item.dart';
import 'package:myapp/logic/doctor/doctor_bloc.dart';
import 'package:myapp/logic/service/service_bloc.dart';

class SpecialtyResultScreen extends StatefulWidget {
  final String specialtyName;
  final int specialtyId;

  const SpecialtyResultScreen({
    super.key,
    required this.specialtyName,
    required this.specialtyId,
  });

  @override
  State<SpecialtyResultScreen> createState() => _SpecialtyResultScreenState();
}

class _SpecialtyResultScreenState extends State<SpecialtyResultScreen> {
  int selectedServiceIndex = 0;
  late final ServiceBloc _serviceBloc;
  late final DoctorBloc _doctorBloc;

  @override
  void initState() {
    super.initState();
    _serviceBloc = ServiceBloc()
      ..add(GetServicesBySpecialty(specialtyId: widget.specialtyId));
    _doctorBloc = DoctorBloc()
      ..add(GetDoctorsBySpecialty(widget.specialtyId));
  }

  @override
  void dispose() {
    _serviceBloc.close();
    _doctorBloc.close();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider.value(value: _serviceBloc),
        BlocProvider.value(value: _doctorBloc),
      ],
      child: Scaffold(
        backgroundColor: Colors.white,
        body: CustomScrollView(
          slivers: [
            _buildAppBar(),
            
            SliverToBoxAdapter(
              child: BlocBuilder<ServiceBloc, ServiceState>(
                builder: (context, state) {
                  List<ServiceModel> services = [];
                  bool isLoading = state is ServiceLoading;

                  if (state is ServiceBySpecialtyLoaded) {
                    services = state.services;
                  }

                  return _buildServiceSection(services, isLoading);
                },
              ),
            ),

            BlocBuilder<DoctorBloc, DoctorState>(
              builder: (context, state) {
                if (state is DoctorLoading) {
                  return const SliverFillRemaining(
                    child: Center(
                      child: CircularProgressIndicator(color: Color(0xFF00B4D8)),
                    ),
                  );
                }

                if (state is DoctorBySpecialtyLoaded) {
                  return _buildDoctorList(state.doctors);
                }

                if (state is DoctorByServiceLoaded) {
                  return _buildDoctorList(state.doctors);
                }

                if (state is DoctorError) {
                  return SliverToBoxAdapter(
                    child: Center(child: Text(state.message)),
                  );
                }

                return const SliverToBoxAdapter(child: SizedBox.shrink());
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
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
            child: Icon(Icons.medical_information,
                size: 80, color: Colors.white.withOpacity(0.2)),
          ),
        ),
      ),
    );
  }

  Widget _buildServiceSection(List<ServiceModel> services, bool isLoading) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Chọn dịch vụ cần khám",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          SizedBox(
            height: 45,
            child: isLoading && services.isEmpty
                ? const Center(child: LinearProgressIndicator())
                : ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: services.length + 1,
                    itemBuilder: (context, index) {
                      bool isSelected = selectedServiceIndex == index;
                      String name = index == 0 ? "Tất cả" : services[index - 1].name;

                      return GestureDetector(
                        onTap: () {
                          setState(() => selectedServiceIndex = index);
                          
                          if (index == 0) {
                            _doctorBloc.add(GetDoctorsBySpecialty(widget.specialtyId));
                          } else {
                            final serviceId = services[index - 1].id;
                            _doctorBloc.add(GetDoctorsByService(serviceId));
                          }
                        },
                        child: Container(
                          margin: const EdgeInsets.only(right: 10),
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFF00B4D8) : Colors.grey[100],
                            borderRadius: BorderRadius.circular(25),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            name,
                            style: TextStyle(
                                color: isSelected ? Colors.white : Colors.black87,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal),
                          ),
                        ),
                      );
                    },
                  ),
          ),
          if (selectedServiceIndex != 0 && services.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 10, left: 5),
              child: Text(
                "Giá tham khảo: ${services[selectedServiceIndex - 1].price} VNĐ",
                style: const TextStyle(color: Colors.blueGrey, fontStyle: FontStyle.italic),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildDoctorList(List<DoctorModel> doctors) {
    if (doctors.isEmpty) {
      return const SliverToBoxAdapter(
        child: Padding(
          padding: EdgeInsets.only(top: 50),
          child: Center(child: Text("Không tìm thấy bác sĩ phù hợp")),
        ),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) => DoctorItem(doctor: doctors[index]),
          childCount: doctors.length,
        ),
      ),
    );
  }
}
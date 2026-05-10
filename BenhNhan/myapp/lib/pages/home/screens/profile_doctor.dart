import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/models/doctor.dart';
import 'package:myapp/logic/doctor/doctor_bloc.dart';
import 'package:myapp/logic/service/service_bloc.dart';
import 'package:myapp/pages/home/screens/booking_screen.dart';

class DoctorProfileScreen extends StatefulWidget {
  final int doctorId; 
  final DoctorModel? initialDoctor; 
  const DoctorProfileScreen({
    super.key, 
    required this.doctorId, 
    this.initialDoctor
  });

  @override
  State<DoctorProfileScreen> createState() => _DoctorProfileScreenState();
}

class _DoctorProfileScreenState extends State<DoctorProfileScreen> {

  @override

  void initState() {
    super.initState();
    context.read<DoctorBloc>().add(GetDoctorDetail(widget.doctorId));
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<DoctorBloc, DoctorState>(
      builder: (context, state) {
        DoctorModel? doctor = widget.initialDoctor;
        if (state is DoctorDetailLoaded) {
          doctor = state.doctor;
        }

        if (state is DoctorLoading && doctor == null) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator(color: Color(0xFF00B4D8))),
          );
        }

        if (doctor == null) {
          return const Scaffold(
            body: Center(child: Text("Không tìm thấy thông tin bác sĩ")),
          );
        }

        return Scaffold(
          backgroundColor: Colors.white,
          bottomNavigationBar: _buildBottomAction(context, doctor),
          body: _buildMainContent(context, doctor),
        );
      },
    );
  }

  Widget _buildMainContent(BuildContext context, DoctorModel doctor) {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 100), 
      child: Column(
        children: [
          _buildHeader(context, doctor),
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildStatsRow(doctor),
                const SizedBox(height: 25),
                const Text(
                  "Giới thiệu",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                Text(
                  doctor.bio.isEmpty
                      ? "Chưa có thông tin giới thiệu chi tiết cho bác sĩ này."
                      : doctor.bio,
                  style: const TextStyle(color: Colors.black87, height: 1.5, fontSize: 15),
                ),
                const SizedBox(height: 25),
                const Text(
                  "Chuyên khoa",
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 10),
                _buildSpecialtyChip(doctor),
                const SizedBox(height: 25),
                // Có thể thêm thông tin phòng khám/giá tiền ở đây
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, DoctorModel doctor) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 50, 20, 30),
      decoration: const BoxDecoration(
        color: Color(0xFF00B4D8),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(40),
          bottomRight: Radius.circular(40),
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back_ios, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
              const Icon(Icons.favorite_border, color: Colors.white),
            ],
          ),
          const SizedBox(height: 10),
          CircleAvatar(
            radius: 60,
            backgroundColor: Colors.white,
            child: CircleAvatar(
              radius: 56,
              backgroundColor: Colors.grey[200],
              backgroundImage:doctor.avatarUrl.isNotEmpty
                  ? NetworkImage(doctor.avatarUrl)
                  : null,
              child: doctor.avatarUrl.isEmpty
                  ? const Icon(Icons.person, size: 60, color: Color(0xFF00B4D8))
                  : null,
            ),
          ),
          const SizedBox(height: 15),
          Text(
            doctor.fullName,
            style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 5),
          Text(
            doctor.degree.toUpperCase(),
            style: const TextStyle(color: Colors.white70, fontSize: 13, fontWeight: FontWeight.w500, letterSpacing: 1.1),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow(DoctorModel doctor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildStatItem("Kinh nghiệm", "10 năm"), // Có thể lấy từ model nếu có
        _buildStatItem("Đánh giá", doctor.rating.toString()),
      ],
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: Color(0xFF00B4D8), fontSize: 18, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _buildSpecialtyChip(DoctorModel doctor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: const Color(0xFF00B4D8).withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF00B4D8).withOpacity(0.2)),
      ),
      child: Text(
        doctor.specialtyName,
        style: const TextStyle(color: Color(0xFF00B4D8), fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildBottomAction(BuildContext context, DoctorModel doctor) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05), 
            blurRadius: 10, 
            offset: const Offset(0, -5)
          )
        ],
      ),
      child: SafeArea(
        child: ElevatedButton(
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => MultiBlocProvider(
                  providers: [
                    BlocProvider(create: (_) => DoctorBloc()),
                    BlocProvider(create: (_) => ServiceBloc()),
                  ],
                  child: BookingScreen(doctor: doctor),
                ),
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
            style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
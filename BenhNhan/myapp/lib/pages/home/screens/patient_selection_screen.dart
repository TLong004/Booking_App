import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/booking/booking_bloc.dart';
import 'package:myapp/logic/patient/patient_bloc.dart';
import 'package:myapp/models/patient.dart';
import 'package:myapp/pages/home/screens/confirm_booking_screen.dart';
import 'package:myapp/pages/home/screens/create_patient_screen.dart';

class PatientSelectionScreen extends StatefulWidget {
  final Map<String, dynamic> bookingData;

  const PatientSelectionScreen({super.key, required this.bookingData});

  @override
  State<PatientSelectionScreen> createState() => _PatientSelectionScreenState();
}

class _PatientSelectionScreenState extends State<PatientSelectionScreen> {
  int? selectedPatientId;

  @override
  void initState() {
    super.initState();
    context.read<PatientBloc>().add(GetPatients());
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: const Text("Chọn hồ sơ bệnh nhân",
              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
          centerTitle: true,
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios, color: Colors.black, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
          bottom: const TabBar(
            indicatorColor: Color(0xFF00B4D8),
            labelColor: Color(0xFF00B4D8),
            unselectedLabelColor: Colors.grey,
            labelStyle: TextStyle(fontWeight: FontWeight.bold),
            tabs: [
              Tab(text: "Bản thân"),
              Tab(text: "Người thân"),
            ],
          ),
        ),
        body: BlocBuilder<PatientBloc, PatientState>(
          builder: (context, state) {
            if (state is PatientLoading || state is PatientInitial) {
              return const Center(child: CircularProgressIndicator(color: Color(0xFF00B4D8)));
            }
            if (state is PatientError) {
              return Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(state.message, style: const TextStyle(color: Colors.red)),
                    const SizedBox(height: 12),
                    TextButton(
                      onPressed: () => context.read<PatientBloc>().add(GetPatients()),
                      child: const Text("Thử lại"),
                    ),
                  ],
                ),
              );
            }

            final patients = state is PatientLoaded ? state.patients : <PatientModel>[];
            // isOwner == true → bản thân, isOwner == false → người thân
            final selfList = patients.where((p) => p.isSelf).toList();
            final relativeList = patients.where((p) => !p.isSelf).toList();

            return TabBarView(
              children: [
                _buildTab(selfList, isSelfTab: true),
                _buildTab(relativeList, isSelfTab: false),
              ],
            );
          },
        ),
        bottomNavigationBar: _buildBottomAction(),
      ),
    );
  }

  Widget _buildTab(List<PatientModel> list, {required bool isSelfTab}) {
    if (list.isEmpty) {
      return _buildEmptyState(isSelfTab: isSelfTab);
    }

    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
      itemCount: list.length + (isSelfTab ? 0 : 1),
      itemBuilder: (context, index) {
        if (!isSelfTab && index == list.length) {
          return _buildAddButton();
        }
        return _buildPatientCard(list[index]);
      },
    );
  }

  Widget _buildEmptyState({required bool isSelfTab}) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.person_off_outlined, size: 64, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          Text(
            isSelfTab ? "Bạn chưa có hồ sơ bản thân" : "Chưa có hồ sơ người thân",
            style: const TextStyle(color: Colors.grey, fontSize: 15),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () => Navigator.push(context, MaterialPageRoute(
              builder: (_) => CreatePatientScreen(isOwner: isSelfTab),
            )),
            icon: const Icon(Icons.add),
            label: Text(isSelfTab ? "Tạo hồ sơ bản thân" : "Thêm hồ sơ người thân"),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF00B4D8),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPatientCard(PatientModel patient) {
    final isSelected = selectedPatientId == patient.id;

    return GestureDetector(
      onTap: () => setState(() => selectedPatientId = patient.id),
      child: Container(
        margin: const EdgeInsets.only(bottom: 15),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF00B4D8).withValues(alpha: 0.05) : Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(
            color: isSelected ? const Color(0xFF00B4D8) : Colors.grey.shade200,
            width: 1.5,
          ),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6)],
        ),
        child: Row(
          children: [
            CircleAvatar(
              backgroundColor: isSelected ? const Color(0xFF00B4D8) : Colors.grey.shade200,
              child: Icon(Icons.person, color: isSelected ? Colors.white : Colors.grey),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(patient.fullName,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 4),
                  Text(
                    "${patient.dob.isNotEmpty ? patient.dob : 'Chưa có ngày sinh'} | ${patient.gender}",
                    style: const TextStyle(color: Colors.grey, fontSize: 13),
                  ),
                ],
              ),
            ),
            // Nút xem chi tiết
            IconButton(
              icon: const Icon(Icons.info_outline, color: Color(0xFF00B4D8)),
              tooltip: "Xem chi tiết",
              onPressed: () => _showDetailSheet(patient),
            ),
            if (isSelected) const Icon(Icons.check_circle, color: Color(0xFF00B4D8)),
          ],
        ),
      ),
    );
  }

  void _showDetailSheet(PatientModel patient) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (_) => Padding(
        padding: const EdgeInsets.fromLTRB(24, 20, 24, 32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40, height: 4,
                decoration: BoxDecoration(
                    color: Colors.grey.shade300,
                    borderRadius: BorderRadius.circular(2)),
              ),
            ),
            const SizedBox(height: 16),
            const Text("Chi tiết hồ sơ",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const Divider(height: 24),
            _detailRow(Icons.person, "Họ tên", patient.fullName),
            _detailRow(Icons.cake_outlined, "Ngày sinh",
                patient.dob.isNotEmpty ? patient.dob : "Chưa cập nhật"),
            _detailRow(Icons.wc, "Giới tính", patient.gender),
            _detailRow(Icons.phone_outlined, "Số điện thoại",
                patient.phoneNumber.isNotEmpty ? patient.phoneNumber : "Chưa cập nhật"),
            _detailRow(Icons.credit_card_outlined, "CCCD",
                patient.cccd.isNotEmpty ? patient.cccd : "Chưa cập nhật"),
            _detailRow(Icons.location_on_outlined, "Địa chỉ",
                patient.address.isNotEmpty ? patient.address : "Chưa cập nhật"),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  setState(() => selectedPatientId = patient.id);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00B4D8),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: const Text("Chọn hồ sơ này",
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: const Color(0xFF00B4D8)),
          const SizedBox(width: 12),
          SizedBox(
            width: 110,
            child: Text(label, style: const TextStyle(color: Colors.grey, fontSize: 14)),
          ),
          Expanded(
            child: Text(value,
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
          ),
        ],
      ),
    );
  }

  Widget _buildAddButton() {
    return Padding(
      padding: const EdgeInsets.only(top: 5),
      child: OutlinedButton.icon(
        onPressed: () => Navigator.push(context, MaterialPageRoute(
          builder: (_) => const CreatePatientScreen(isOwner: false),
        )),
        icon: const Icon(Icons.add_circle_outline),
        label: const Text("Thêm hồ sơ người thân mới"),
        style: OutlinedButton.styleFrom(
          foregroundColor: const Color(0xFF00B4D8),
          side: const BorderSide(color: Color(0xFF00B4D8)),
          padding: const EdgeInsets.symmetric(vertical: 15),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      ),
    );
  }

  Widget _buildBottomAction() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))
        ],
      ),
      child: SafeArea(
        child: ElevatedButton(
          onPressed: selectedPatientId != null ? _goToReview : null,
          style: ElevatedButton.styleFrom(
            backgroundColor: selectedPatientId != null ? const Color(0xFF00B4D8) : Colors.grey.shade300,
            minimumSize: const Size(double.infinity, 55),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
            elevation: selectedPatientId != null ? 5 : 0,
          ),
          child: Text(
            "XÁC NHẬN HỒ SƠ",
            style: TextStyle(
              color: selectedPatientId != null ? Colors.white : Colors.grey.shade500,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
        ),
      ),
    );
  }

  void _goToReview() {
    final state = context.read<PatientBloc>().state;
    final patients = state is PatientLoaded ? state.patients : <PatientModel>[];
    final patient = patients.firstWhere((p) => p.id == selectedPatientId);
    final d = widget.bookingData;

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => BlocProvider(
          create: (_) => BookingBloc(),
          child: ConfirmBookingScreen(
            doctorId: d['doctorId'] as int,
            doctorName: d['doctorName'] as String,
            specialtyName: d['specialtyName'] as String,
            date: d['date'] as String,
            slotTime: d['slotTime'] as String,
            scheduleId: d['scheduleId'] as int? ?? 0,
            serviceName: d['serviceName'] as String,
            patientId: patient.id!,
            patientName: patient.fullName,
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/booking/booking_bloc.dart';

class ConfirmBookingScreen extends StatefulWidget {
  final int doctorId;
  final String doctorName;
  final String specialtyName;
  final String date;
  final String slotTime;
  final int scheduleId;
  final String serviceName;

  final int patientId;
  final String patientName;

  const ConfirmBookingScreen({
    super.key,
    required this.doctorId,
    required this.doctorName,
    required this.specialtyName,
    required this.date,
    required this.slotTime,
    required this.scheduleId,
    required this.serviceName,
    required this.patientId,
    required this.patientName,
  });

  @override
  State<ConfirmBookingScreen> createState() => _ConfirmBookingScreenState();
}

class _ConfirmBookingScreenState extends State<ConfirmBookingScreen> {
  final _symptomsCtrl = TextEditingController();

  @override
  void dispose() {
    _symptomsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<BookingBloc, BookingState>(
      listener: (context, state) {
        if (state is BookingSuccess) {
          _showSuccessDialog(state.message);
        }
        if (state is BookingError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message), backgroundColor: Colors.red),
          );
        }
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: const Text("Xác nhận đặt lịch",
              style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
          centerTitle: true,
          backgroundColor: Colors.white,
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back_ios, color: Colors.black, size: 20),
            onPressed: () => Navigator.pop(context),
          ),
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSummaryCard(),
              const SizedBox(height: 24),
              _buildSymptomsInput(),
              const SizedBox(height: 100),
            ],
          ),
        ),
        bottomNavigationBar: _buildConfirmButton(),
      ),
    );
  }

  Widget _buildSummaryCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.06), blurRadius: 12)],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text("Thông tin lịch hẹn",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          const Divider(height: 20),
          _row(Icons.person_outline, "Bác sĩ", widget.doctorName),
          _row(Icons.local_hospital_outlined, "Chuyên khoa", widget.specialtyName),
          _row(Icons.medical_services_outlined, "Dịch vụ", widget.serviceName),
          _row(Icons.calendar_today_outlined, "Ngày khám", widget.date),
          _row(Icons.access_time_outlined, "Giờ khám", widget.slotTime),
          const Divider(height: 20),
          _row(Icons.account_circle_outlined, "Hồ sơ bệnh nhân", widget.patientName),
        ],
      ),
    );
  }

  Widget _row(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, size: 20, color: const Color(0xFF00B4D8)),
          const SizedBox(width: 12),
          SizedBox(
            width: 130,
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

  Widget _buildSymptomsInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text("Triệu chứng (không bắt buộc)",
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text("Mô tả ngắn gọn triệu chứng để bác sĩ chuẩn bị trước",
            style: TextStyle(color: Colors.grey, fontSize: 13)),
        const SizedBox(height: 12),
        TextField(
          controller: _symptomsCtrl,
          maxLines: 4,
          maxLength: 300,
          decoration: InputDecoration(
            hintText: "VD: Đau đầu, sốt nhẹ 2 ngày, chóng mặt...",
            hintStyle: TextStyle(color: Colors.grey.shade400, fontSize: 14),
            filled: true,
            fillColor: Colors.grey.shade50,
            contentPadding: const EdgeInsets.all(16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFF00B4D8), width: 1.5),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildConfirmButton() {
    return BlocBuilder<BookingBloc, BookingState>(
      builder: (context, state) {
        final isLoading = state is BookingLoading;
        return Container(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 30),
          decoration: BoxDecoration(
            color: Colors.white,
            boxShadow: [BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, -5))],
          ),
          child: SafeArea(
            child: ElevatedButton(
              onPressed: isLoading ? null : _submit,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00B4D8),
                minimumSize: const Size(double.infinity, 55),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                elevation: 5,
              ),
              child: isLoading
                  ? const CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                  : const Text("XÁC NHẬN ĐẶT LỊCH",
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
            ),
          ),
        );
      },
    );
  }

  void _submit() {
    context.read<BookingBloc>().add(CreateBooking(
      patientId: widget.patientId,
      doctorId: widget.doctorId,
      scheduleId: widget.scheduleId,
      symptoms: _symptomsCtrl.text.trim(),
    ));
  }

  void _showSuccessDialog(String message) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle, color: Color(0xFF00B4D8), size: 64),
            const SizedBox(height: 16),
            const Text("Đặt lịch thành công!",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(message, textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.grey)),
          ],
        ),
        actions: [
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                // Quay về trang chủ
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF00B4D8),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text("Về trang chủ",
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}

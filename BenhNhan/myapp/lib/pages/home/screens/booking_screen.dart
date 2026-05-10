import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/doctor/doctor_bloc.dart';
import 'package:myapp/logic/service/service_bloc.dart';
import 'package:myapp/models/doctor.dart';
import 'package:intl/intl.dart';
import 'package:myapp/pages/home/screens/patient_selection_screen.dart';
import 'package:myapp/pages/home/widgets/doctor_sumary.dart';

class BookingScreen extends StatefulWidget {
  final DoctorModel doctor;

  const BookingScreen({super.key, required this.doctor});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  String? selectedDate;
  int? selectedSlotId;
  String? selectedSlotTime;
  int? selectedServiceId;
  String? selectedServiceName;

  @override
  void initState() {
    super.initState();
    context.read<DoctorBloc>().add(LoadAvailableDates(widget.doctor.id));
    context.read<ServiceBloc>().add(GetServicesByDoctor(doctorId: widget.doctor.id)); 
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text("Đặt lịch hẹn", style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18)),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: BlocBuilder<DoctorBloc, DoctorState>(
        builder: (context, state) {
          List<String> dates = [];
          if (state is DateLoaded) dates = state.availableDates;
          if (state is SlotLoaded) dates = state.availableDates;

          if ((state is DoctorLoading || state is DatesLoading) && dates.isEmpty) {
            return const Center(child: CircularProgressIndicator(color: Color(0xFF00B4D8)));
          }

          if (state is DoctorError) {
            return Center(child: Text("Lỗi: ${state.message}", style: const TextStyle(color: Colors.red)));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                DoctorSumary(doctor: widget.doctor),
                const SizedBox(height: 25),

                const Text("Dịch vụ", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                _buildServiceDropdown(),
                const SizedBox(height: 25),

                const Text("Chọn ngày khám", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 15),
                if (dates.isNotEmpty)
                  _buildDateTable(dates)
                else
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 20),
                    child: Center(child: Text("Bác sĩ hiện không có lịch làm việc", style: TextStyle(color: Colors.grey))),
                  ),

                const SizedBox(height: 25),

                const Text("Khung giờ trống", style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 15),
                _buildTimeSection(state),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: _buildBottomConfirm(),
    );
  }

  Widget _buildServiceDropdown() {
    return BlocBuilder<ServiceBloc, ServiceState>(
      builder: (context, state) {
        if (state is ServiceLoading) return const LinearProgressIndicator(color: Color(0xFF00B4D8));
        
        List<dynamic> services = [];
        if (state is ServiceBySpecialtyLoaded) services = state.services;

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade200),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<int>(
              isExpanded: true,
              value: selectedServiceId,
              hint: const Text("Vui lòng chọn dịch vụ khám", style: TextStyle(fontSize: 14)),
              icon: const Icon(Icons.keyboard_arrow_down, color: Color(0xFF00B4D8)),
              items: services.map((s) => DropdownMenuItem<int>(
                value: s.id, 
                child: Text("${s.name} - ${NumberFormat.decimalPattern().format(s.price)}đ", style: const TextStyle(fontSize: 14))
              )).toList(),
              onChanged: (v) {
                final service = services.firstWhere((s) => s.id == v);
                setState(() {
                  selectedServiceId = v;
                  selectedServiceName = service.name;
                });
              },
            ),
          ),
        );
      },
    );
  }

  Widget _buildDateTable(List<String> availableDates) {
    DateTime now = DateTime.now();
    List<DateTime> displayDates = List.generate(14, (index) => now.add(Duration(days: index)));

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7, 
        mainAxisSpacing: 8, crossAxisSpacing: 8, childAspectRatio: 0.8
      ),
      itemCount: displayDates.length,
      itemBuilder: (context, index) {
        DateTime date = displayDates[index];
        String dateStr = DateFormat('yyyy-MM-dd').format(date);
        bool isWorking = availableDates.contains(dateStr);
        bool isSelected = selectedDate == dateStr;

        return GestureDetector(
          onTap: isWorking ? () {
            setState(() {
              selectedDate = dateStr;
              selectedSlotId = null; 
            });
            context.read<DoctorBloc>().add(LoadAvailableSlots(widget.doctor.id, dateStr));
          } : null,
          child: Container(
            decoration: BoxDecoration(
              color: isSelected ? const Color(0xFF00B4D8) : (isWorking ? Colors.white : Colors.grey.shade100),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: isWorking ? const Color(0xFF00B4D8) : Colors.transparent, width: 1),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(DateFormat('E').format(date), style: TextStyle(fontSize: 10, color: isSelected ? Colors.white70 : (isWorking ? Colors.black54 : Colors.grey.shade400))),
                const SizedBox(height: 4),
                Text(date.day.toString(), style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: isSelected ? Colors.white : (isWorking ? Colors.black : Colors.grey.shade300))),
                if (isWorking && !isSelected)
                  Container(margin: const EdgeInsets.only(top: 2), width: 4, height: 4, decoration: const BoxDecoration(color: Color(0xFF00B4D8), shape: BoxShape.circle))
              ],
            ),
          ),
        );
      },
    );
  }

  // --- 4. CHỌN GIỜ ---
  Widget _buildTimeSection(DoctorState state) {
    if (selectedDate == null) {
      return Container(
        width: double.infinity, padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(10)),
        child: const Center(child: Text("Chọn ngày để xem giờ khám", style: TextStyle(color: Colors.grey, fontSize: 13))),
      );
    }

    if (state is SlotsLoading) {
      return const Center(child: Padding(padding: EdgeInsets.all(20.0), child: CircularProgressIndicator(color: Color(0xFF00B4D8))));
    }

    if (state is SlotLoaded) {
      if (state.availableSlots.isEmpty) {
        return const Center(child: Text("Ngày này đã kín lịch.", style: TextStyle(color: Colors.red, fontSize: 13)));
      }
      return GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3, crossAxisSpacing: 10, mainAxisSpacing: 10, childAspectRatio: 2.3
        ),
        itemCount: state.availableSlots.length,
        itemBuilder: (context, index) {
          final slot = state.availableSlots[index];
          bool isSelected = selectedSlotId == slot.id;

          return GestureDetector(
            onTap: () => setState(() {
              selectedSlotId = slot.id;
              selectedSlotTime = slot.startTime;
            }),
            child: Container(
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFF00B4D8) : Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: isSelected ? const Color(0xFF00B4D8) : Colors.grey.shade300),
              ),
              child: Text(slot.startTime, style: TextStyle(fontSize: 14, color: isSelected ? Colors.white : Colors.black87, fontWeight: isSelected ? FontWeight.bold : FontWeight.normal)),
            ),
          );
        },
      );
    }
    return const SizedBox();
  }

  Widget _buildBottomConfirm() {
    bool canConfirm = selectedDate != null && selectedSlotId != null && selectedServiceId != null;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 10, 20, 15),
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: canConfirm ? const Color(0xFF00B4D8) : Colors.grey.shade300,
              minimumSize: const Size(double.infinity, 50),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              elevation: 0,
            ),
            onPressed: canConfirm ? () => _confirmBooking() : null,
            child: Text("TIẾP TỤC", style: TextStyle(color: canConfirm ? Colors.white : Colors.grey.shade500, fontWeight: FontWeight.bold, fontSize: 16)),
          ),
        ),
      ),
    );
  }

  void _confirmBooking() {
    final data = {
      "doctorId": widget.doctor.id,
      "doctorName": widget.doctor.fullName,
      "specialtyName": widget.doctor.specialtyName,
      "serviceId": selectedServiceId,
      "serviceName": selectedServiceName ?? '',
      "date": selectedDate ?? '',
      "scheduleId": selectedSlotId,
      "slotTime": selectedSlotTime ?? '',
    };

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PatientSelectionScreen(bookingData: data),
      ),
    );
  }
}
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:myapp/logic/patient/patient_bloc.dart';

class CreatePatientScreen extends StatefulWidget {
  final bool isOwner; // true = bản thân, false = người thân

  const CreatePatientScreen({super.key, required this.isOwner});

  @override
  State<CreatePatientScreen> createState() => _CreatePatientScreenState();
}

class _CreatePatientScreenState extends State<CreatePatientScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameCtrl = TextEditingController();
  final _dobCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _cccdCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  String _gender = 'Nam';

  @override
  void dispose() {
    _fullNameCtrl.dispose();
    _dobCtrl.dispose();
    _phoneCtrl.dispose();
    _cccdCtrl.dispose();
    _addressCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<PatientBloc, PatientState>(
      listener: (context, state) {
        if (state is PatientCreated) {
          // Reload danh sách rồi quay lại
          context.read<PatientBloc>().add(GetPatients());
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text("Tạo hồ sơ thành công!"),
              backgroundColor: Color(0xFF00B4D8),
            ),
          );
        }
        if (state is PatientError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message), backgroundColor: Colors.red),
          );
        }
      },
      child: Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          title: Text(
            widget.isOwner ? "Tạo hồ sơ bản thân" : "Thêm hồ sơ người thân",
            style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 18),
          ),
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
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildField(
                  label: "Họ và tên *",
                  controller: _fullNameCtrl,
                  hint: "Nguyễn Văn A",
                  validator: (v) => v == null || v.trim().isEmpty ? "Vui lòng nhập họ tên" : null,
                ),
                const SizedBox(height: 20),
                _buildLabel("Giới tính *"),
                const SizedBox(height: 8),
                _buildGenderSelector(),
                const SizedBox(height: 20),
                _buildField(
                  label: "Ngày sinh *",
                  controller: _dobCtrl,
                  hint: "YYYY-MM-DD",
                  keyboardType: TextInputType.datetime,
                  suffixIcon: Icons.calendar_today_outlined,
                  onSuffixTap: () => _pickDate(),
                  validator: (v) => v == null || v.trim().isEmpty ? "Vui lòng nhập ngày sinh" : null,
                ),
                const SizedBox(height: 20),
                _buildField(
                  label: "Số điện thoại",
                  controller: _phoneCtrl,
                  hint: "0901234567",
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 20),
                _buildField(
                  label: "CCCD / CMND",
                  controller: _cccdCtrl,
                  hint: "079200012345",
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 20),
                _buildField(
                  label: "Địa chỉ",
                  controller: _addressCtrl,
                  hint: "123 Nguyễn Huệ, TP.HCM",
                  maxLines: 2,
                ),
                const SizedBox(height: 36),
                BlocBuilder<PatientBloc, PatientState>(
                  builder: (context, state) {
                    final isLoading = state is PatientLoading;
                    return SizedBox(
                      width: double.infinity,
                      height: 55,
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _submit,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF00B4D8),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                          elevation: 5,
                        ),
                        child: isLoading
                            ? const CircularProgressIndicator(color: Colors.white, strokeWidth: 2)
                            : const Text("LƯU HỒ SƠ",
                                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Text(text, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.black87));
  }

  Widget _buildField({
    required String label,
    required TextEditingController controller,
    required String hint,
    TextInputType keyboardType = TextInputType.text,
    int maxLines = 1,
    String? Function(String?)? validator,
    IconData? suffixIcon,
    VoidCallback? onSuffixTap,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildLabel(label),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          maxLines: maxLines,
          validator: validator,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: Colors.grey.shade400),
            filled: true,
            fillColor: Colors.grey.shade50,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Colors.red),
            ),
            suffixIcon: suffixIcon != null
                ? IconButton(
                    icon: Icon(suffixIcon, color: const Color(0xFF00B4D8)),
                    onPressed: onSuffixTap,
                  )
                : null,
          ),
        ),
      ],
    );
  }

  Widget _buildGenderSelector() {
    return Row(
      children: ['Nam', 'Nữ', 'Khác'].map((g) {
        final isSelected = _gender == g;
        return Padding(
          padding: const EdgeInsets.only(right: 12),
          child: GestureDetector(
            onTap: () => setState(() => _gender = g),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFF00B4D8) : Colors.grey.shade50,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: isSelected ? const Color(0xFF00B4D8) : Colors.grey.shade200,
                ),
              ),
              child: Text(
                g,
                style: TextStyle(
                  color: isSelected ? Colors.white : Colors.black87,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(primary: Color(0xFF00B4D8)),
        ),
        child: child!,
      ),
    );
    if (picked != null) {
      _dobCtrl.text =
          "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
    }
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    context.read<PatientBloc>().add(CreatePatient({
      'fullName': _fullNameCtrl.text.trim(),
      'dob': _dobCtrl.text.trim(),
      'gender': _gender,
      'phoneNumber': _phoneCtrl.text.trim(),
      'cccd': _cccdCtrl.text.trim(),
      'address': _addressCtrl.text.trim(),
      'isOwner': widget.isOwner,
    }));
  }
}

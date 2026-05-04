import 'package:flutter/material.dart';

class ModernInput extends StatefulWidget {
  final String hint;
  final String label;
  final IconData icon;
  final Color primaryColor;
  final bool isPassword;
  final TextEditingController? controller;

  const ModernInput({super.key, required this.hint, required this.label, required this.icon, required this.primaryColor, this.isPassword = false, this.controller});

  @override
  State<ModernInput> createState() => _ModernInputState();
}

class _ModernInputState extends State<ModernInput> {
  bool _isObscure = true;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        const SizedBox(height: 10),
        TextField(
          controller: widget.controller,
          obscureText: widget.isPassword ? _isObscure : false, 
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: const TextStyle(color: Colors.grey, fontSize: 14),
            prefixIcon: Icon(widget.icon, color: widget.primaryColor, size: 20),
            
            suffixIcon: widget.isPassword 
              ? IconButton(
                  icon: Icon(
                    _isObscure ? Icons.visibility_off_rounded : Icons.visibility_rounded,
                    color: Colors.grey,
                  ),
                  onPressed: () {
                    setState(() {
                      _isObscure = !_isObscure;
                    });
                  },
                )
              : null, 
              
            filled: true,
            fillColor: const Color(0xFFF1F4F8),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(15),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(vertical: 18),
          ),
        ),
      ],
    );
  }
}
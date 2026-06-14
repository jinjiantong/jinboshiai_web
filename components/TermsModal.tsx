'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const termsContent = {
  lastUpdated: '2024年1月1日',
  content: [
    {
      title: '服务说明',
      text: '金博士AI实验室（以下简称"我们"）向您提供AI教育课程和学习服务。您使用我们的服务即表示您同意遵守本服务条款。请在使用前仔细阅读所有条款。'
    },
    {
      title: '账号注册',
      text: '您需要提供真实、准确的信息进行账号注册。您有责任妥善保管账号信息，如因个人保管不当导致的账号被盗用，我们不承担责任。您不得借用、转让或共享您的账号给他人使用。'
    },
    {
      title: '课程学习',
      text: '付费课程：购买后即可获得课程学习权限，有效期内可无限次观看。课程有效期以购买页面标注为准。退款政策：开课7天内且学习进度不足30%，可申请全额退款；超出上述条件不予退款。'
    },
    {
      title: '学习资源',
      text: '我们提供的课程视频、课件、源码等学习资源仅供您个人学习使用，未经书面授权，不得进行复制、传播、分享或用于商业目的。侵犯版权的行为将承担相应法律责任。'
    },
    {
      title: '用户行为',
      text: '您同意不会利用我们的服务从事任何违法活动；不会发布违反法律法规、公序良俗的内容；不会骚扰、侮辱或伤害其他用户；不会尝试破解、入侵或破坏我们的系统。'
    },
    {
      title: '知识产权',
      text: '我们网站、课程内容、LOGO、教材等所有知识产权归我们所有。未经授权，用户不得对我们享有知识产权的内容进行复制、修改、传播或商业使用。'
    },
    {
      title: '服务变更',
      text: '我们保留随时修改或中断服务的权利。如因系统维护、升级或不可抗力导致服务暂停，我们将在合理期限内通知用户。我们会尽力保证服务的连续性和稳定性。'
    },
    {
      title: '免责声明',
      text: '我们不对因使用我们的服务而产生的任何直接、间接、附带损失负责。用户需自行承担学习过程中的风险。我们无法保证学习效果，学习成果因人而异。'
    },
    {
      title: '争议解决',
      text: '本服务条款的解释和执行均适用中华人民共和国法律。如双方发生争议，应首先通过友好协商解决；协商不成的，任一方可向有管辖权的人民法院提起诉讼。'
    },
    {
      title: '联系我们',
      text: '如您对本服务条款有任何疑问，请通过以下方式联系我们：客服邮箱 26256649@qq.com，联系电话 15811055744。我们将在收到您的反馈后尽快予以处理。'
    }
  ]
}

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">服务条款</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
              <p className="text-sm text-slate-500 mb-6">最后更新日期：{termsContent.lastUpdated}</p>

              <div className="space-y-6">
                {termsContent.content.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{section.title}</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">{section.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
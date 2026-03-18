import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from '../../common/guards/supabase-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(SupabaseAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('message')
  async sendMessage(
    @Body()
    body: {
      sessionId: string;
      message: string;
      context?: any;
      timestamp?: string;
    },
    @CurrentUser() user: AuthUser,
  ) {
    const history = body.context?.conversationHistory;
    return this.aiService.sendMessage(body.message, body.context, history);
  }

  @Post('equipment')
  async askEquipment(
    @Body()
    body: {
      message: string;
      conversationHistory: { role: string; content: string }[];
      existingItems?: { name: string; quantity: number; totalValue: number }[];
    },
    @CurrentUser() user: AuthUser,
  ) {
    return this.aiService.askEquipment(
      body.message,
      body.conversationHistory || [],
      body.existingItems || [],
    );
  }

  @Post('assess')
  async assessApplication(
    @Body()
    body: {
      company: string;
      contact?: string;
      entityType?: string;
      entitySize?: string;
      dateEstablished?: string;
      annualRevenue?: string;
      requestedAmount?: string;
      equipment: string;
      equipmentItems?: any[];
      documentsVerified: number;
      documentsTotal: number;
    },
    @CurrentUser() user: AuthUser,
  ) {
    return this.aiService.assessApplication(body);
  }

  @Get('qualification/:sessionId')
  async getQualificationStatus(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: AuthUser,
  ) {
    // Placeholder — qualification scoring is future work
    return {
      score: 0,
      factors: {},
      recommendations: [],
    };
  }
}
